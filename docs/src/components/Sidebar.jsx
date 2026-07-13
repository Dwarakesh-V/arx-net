import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Home, Code, MousePointerClick, Cpu, TerminalSquare } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <button className="mobile-toggle" onClick={toggleSidebar} aria-label="Toggle Menu">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={closeSidebar}></div>

      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Arx-Net Docs</h2>
          <p>Graph Visualization</p>
        </div>
        
        <div className="sidebar-links">
          <NavLink to="/" onClick={closeSidebar} className={({isActive}) => isActive ? 'active' : ''}>
            <Home size={18} /> Introduction
          </NavLink>
          <NavLink to="/generation" onClick={closeSidebar} className={({isActive}) => isActive ? 'active' : ''}>
            <Code size={18} /> Graph Generation
          </NavLink>
          <NavLink to="/interactions" onClick={closeSidebar} className={({isActive}) => isActive ? 'active' : ''}>
            <MousePointerClick size={18} /> UI & Interactions
          </NavLink>
          <NavLink to="/algorithms" onClick={closeSidebar} className={({isActive}) => isActive ? 'active' : ''}>
            <Cpu size={18} /> Algorithms
          </NavLink>
          <NavLink to="/python-integration" onClick={closeSidebar} className={({isActive}) => isActive ? 'active' : ''}>
            <TerminalSquare size={18} /> Python Integration
          </NavLink>
        </div>
      </nav>
    </>
  );
}
