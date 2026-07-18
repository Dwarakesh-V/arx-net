# Edge Parser — Format Reference

`parseEdges(edgesInput, directed = true)` turns a text description of a graph
into an array of edge objects: `{ source, target, weight }` (plus standalone
vertex declarations, see below). It auto-detects which of three input styles
you've used based on the first non-whitespace character.

| First character | Format |
|---|---|
| `{` | Python-style adjacency dict |
| `[` | Python-style edge list *or* a standalone multi-value vertex (see [Ambiguities](#ambiguities--caveats)) |
| anything else | Compact edge notation |

Every format shares the same underlying **vertex** and **weight** grammar,
described first since it applies everywhere.

---

## Vertex values

A vertex (node) token can be any of the following. These rules apply
identically whether the vertex appears in a dict key, a dict value, an
edge-list tuple, or compact notation.

| Syntax | Result | Notes |
|---|---|---|
| `a`, `node1`, `42` | the raw string `"a"`, `"node1"`, `"42"` | Bare tokens are **kept as strings**, even if numeric — for backward compatibility with existing graphs. |
| `"a"` or `'a'` | the string `"a"` | Quotes are stripped. |
| `[10,20]` | the array `[10, 20]` internally, the string `"10,20"` in output `source`/`target` | **Multi-value vertex** — represents a single node holding several keys, e.g. one node of a 2-3, 2-3-4, B-tree, or B+-tree. |
| `10\|20` | same as above | Pipe shorthand for the same thing — no brackets needed. Mirrors the "key \| key \| key" box notation often used to draw B-tree nodes. |

### Output shape for multi-value vertices

Internally, a multi-value vertex is parsed into an array (`[10, 20]`) so that
element order, numeric typing, and dedup all behave correctly. But the
**public** `edge.source` / `edge.target` fields are always plain strings —
never arrays — specifically so downstream code (D3 force-link `.id()`
resolution, `Map`/`Set`/object-keyed node lookups, CSS attribute selectors,
etc.) can keep treating them as stable, comparable identifiers exactly like
it always could. A multi-value vertex is converted to its id by joining the
keys with commas: `[10, 20]` → `"10,20"`.

The original structured keys aren't discarded — they're attached alongside
as `sourceKeys` / `targetKeys` (only present when that side was a
multi-value vertex):

```js
{ source: "10,20", target: "5", weight: 1, sourceKeys: [10, 20] }
```

This guarantees every occurrence of the *same* multi-value vertex — even
though each occurrence is parsed from its own bit of input text into its
own array object — collapses to the exact same `source`/`target` string.
That matters: without it, two edges referencing "the same" node `[10,20]`
would carry two different array objects that are `===`-unequal, and any
reference-based lookup (a `Map` keyed by node, D3's internal node index)
would silently fail to connect them — which is what produces `<path>
attribute d: Expected number, "Mundefined,undefined"` errors: the edge's
`source`/`target` never resolves to an actual positioned node, so `.x`/`.y`
come back `undefined`.

**Inside** a multi-value vertex, each element is parsed a little differently
than a top-level bare token:

- Quoted elements (`'a'`, `"a"`) → strings, quotes stripped.
- Numeric-looking elements (`10`, `-3.5`) → **converted to real numbers**
  (unlike top-level bare vertices, which stay strings).
- Anything else → left as a string.
- Elements can themselves be nested lists (`[[1,2],[3,4]]`), parsed
  recursively.

This means `[10,20]` produces `[10, 20]` (numbers), while a bare top-level
vertex `10` produces `"10"` (string). This asymmetry is intentional — see
[Caveats](#type-inconsistency-between-bare-and-bracketed-single-key-nodes).

---

## Weight values

- Present and numeric → parsed with `parseFloat`.
- Missing, empty, or non-numeric → defaults to `1`.
- Never applies to standalone vertex declarations, where weight is `null`.

---

## Format 1: Compact edge notation

The default format when input doesn't start with `{` or `[`. Comma-separated
list of edges; each edge is one of:

### a) Two-character shorthand
```
ab5
```
`a` → `b`, weight `5`. Weight is optional (`ab` → weight `1`).

**Restricted to single-character node names.** This shorthand's regex only
matches exactly two alphanumeric characters, so it cannot represent
multi-character names or multi-value vertices. Use the parenthesized form
below for anything richer.

### b) Parenthesized tuple
```
(a,b,2)
(source,target)
([10,20],[5],1)
```
`(source, target[, weight])`. `source`/`target` follow the full
[vertex grammar](#vertex-values) above — quoted strings, bracket/pipe
multi-value nodes, or bare identifiers. Weight optional, defaults to `1`.

### c) Standalone vertex declaration
```
[10,20]
42|58
x
```
A single token with no comma-separated peer — declares an isolated vertex
(e.g. a tree root with no children yet) with `target: null, weight: null`.
Triggered when the token is:
- exactly one character long (`x`), **or**
- bracket notation (`[10,20]`), **or**
- pipe notation (`42|58`).

A bare multi-character token that isn't one of these (e.g. `xyz` alone,
with no comma) does **not** match this rule and will raise an
`Invalid edge format` error — see [Caveats](#standalone-declarations-are-narrowly-matched).

### Full example
```
ab5, (c,d,2), [10,20], 42|58, x
```

---

## Format 2: Python-style edge list

Triggered when input starts with `[` **and** looks like a list of tuples
(see [Ambiguities](#ambiguities--caveats) for the exact rule).

```
[('a','b',2), ('b','c')]
[([10,20],[5],1), ([10,20],[15],1)]
```

Each element must be a tuple `(source, target[, weight])`. `source`/`target`
follow the [vertex grammar](#vertex-values). Elements not starting with `(`
are logged as errors and skipped, not raised.

---

## Format 3: Python-style adjacency dict

Triggered when input starts with `{`.

```
{'a': ['b', ('c', 2)], 'b': ['c']}
```

- Keys are vertices (full [vertex grammar](#vertex-values) applies, so keys
  can be `[10,20]` multi-value nodes).
- Values are either:
  - a **list** of neighbours — each neighbour is either a bare vertex token
    (weight defaults to `1`) or a `(neighbour, weight)` tuple, or
  - a **single** neighbour (bare vertex or `(neighbour, weight)` tuple) —
    doesn't need to be wrapped in a list.

### Tree examples
```
# 2-3 tree
{[10,20]: [[5], [15], [25,30]]}

# 2-3-4 tree
{[10,20,30]: [[5], [15], [25], [35,40]]}

# B-tree, order 5 (up to 4 keys/node)
{[20,40,60,80]: [[10], [30], [50], [70], [90,95]]}

# weighted children
{[10,20]: [([5], 1), ([15], 1), ([25,30], 1)]}

# mixed string keys
{['m','t']: [['a','f'], ['p','s'], ['w','z']]}
```

> **B+-trees**: this parser only produces parent → child edges. A B+-tree's
> defining extra feature — the linked list connecting leaf nodes for
> range scans — isn't a parent/child relationship, so it isn't inferred
> automatically. If you need it, add it explicitly as ordinary edges
> between consecutive leaf vertices (e.g. give them a distinct weight or
> keep them in a separate edge set) and interpret them specially in your
> own code; this layer doesn't distinguish leaf/internal nodes for you.

---

## Deduplication & directedness

After parsing, edges are deduplicated:

- **Directed graphs**: later duplicate `source→target` edges overwrite
  earlier ones (last one wins); no special reverse-edge handling.
- **Undirected graphs**: if `b→a` already exists and you add `a→b`, the
  reverse entry is deleted before the new one is added, so only one
  direction is stored per pair.
- **Standalone vertex declarations** are deduplicated by vertex identity
  alone (one entry per distinct vertex, regardless of how many times it's
  declared).
- Vertex identity for dedup purposes uses `JSON.stringify` for array
  (multi-value) vertices and plain string coercion otherwise, so `[2,5]`
  and `[5,2]` are treated as *different* vertices (order matters).

---

## Ambiguities & caveats

#### Top-level `[` is ambiguous between "edge list" and "one standalone vertex"
`[10,20]` as a *complete* input could mean "an edge list containing the bare
entries `10` and `20`" (invalid — list entries must be tuples) or "one
standalone multi-value vertex with keys 10 and 20." The parser resolves
this by inspecting the bracket's contents: if none of the top-level,
comma-separated items start with `(`, it's treated as a single standalone
vertex instead of an edge list. An empty list `[]` is always treated as an
empty edge list.

Practical implication: if you want to declare a lone multi-value root node
as your *entire* input, either notation works —
`[10,20]` or `10|20` — but if you're ever unsure, the pipe form (`10|20`)
sidesteps the ambiguity entirely since it doesn't start with `[`.

#### Type inconsistency between bare and bracketed single-key nodes
A bare vertex like `5` stays the string `"5"`, but a bracketed single-key
vertex `[5]` becomes the array `[5]` (with a real number inside). If your
tree sometimes has single-key nodes and sometimes multi-key nodes, mixing
`5` and `[10,20]` produces inconsistent types (`string` vs `array`) for
otherwise-analogous nodes. **Recommendation:** always use bracket or pipe
notation for tree nodes, even single-key ones (`[5]` instead of `5`), so
every node in a tree has a consistent array type.

#### Standalone declarations are narrowly matched
In compact notation, a lone token is only recognized as a standalone
vertex if it's exactly one character, or uses bracket/pipe notation.
A bare multi-character token like `root` or `xyz`, given alone with no
edge, does **not** match any rule and raises `Invalid edge format`. To
declare a standalone vertex with an arbitrary bare name, quote it and wrap
it as a self-referential tuple isn't supported either — use the adjacency
dict format instead with an empty neighbour list: `{'root': []}`.

#### Vertex order matters for multi-value dedup and identity
`[2,5]` and `[5,2]` are different vertices as far as this parser is
concerned (no key sorting/normalization is applied) — they produce
different id strings (`"2,5"` vs `"5,2"`). If your tree structure assumes
sorted keys, sort them yourself before feeding the parser, or the same
logical node written two different ways will be treated as two different
vertices/nodes downstream.

#### Comma is a reserved separator inside multi-value ids
Since multi-value vertex ids are built by joining keys with `,` (e.g.
`[10,20]` → `"10,20"`), a key that itself contains a literal comma (e.g. a
quoted string element like `'a,b'`) would produce an ambiguous id that
looks identical to a two-key node `['a','b']`. Avoid commas inside
individual key values.

#### Two-character shorthand silently limits node names
`ab5` is unambiguous only because both `a` and `b` are exactly one
character. There's no way to use the two-character shorthand for
multi-character or multi-value nodes — the parenthesized or Python-style
formats are required instead. This isn't a bug, just a hard boundary of
the shorthand.

#### Colon-splitting in adjacency dicts assumes no colons inside keys
When parsing `{key: value}` pairs, the parser splits on the *first*
colon found at bracket-depth zero. This works correctly even when keys or
values contain nested brackets (e.g. `[10,20]`), but would break if a key
or value legitimately contained a literal `:` character outside of quotes
(none of the current vertex grammars produce one, so this is currently a
theoretical caveat rather than an active bug).

#### Errors vs. silent skips
Behavior on malformed input isn't fully uniform:
- Invalid compact-format edges log to `console.error` and are dropped
  from the result (no exception thrown).
- Invalid adjacency-dict entries (no top-level colon) log and are skipped.
- Invalid edge-list tuples (elements not starting with `(`) log and are
  skipped.
- A malformed tuple with fewer than 2 elements (e.g. `(a)`) logs and is
  skipped in both the edge-list and compact-paren formats.

None of these throw — parsing always returns an array (possibly missing
some intended edges), so check your console/logs if the output looks
shorter than expected.