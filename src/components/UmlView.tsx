'use client';

import { useEffect } from 'react';
import mermaid from 'mermaid';

export default function UMLView() {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.contentLoaded();
  }, []);

  const diagram = `
    classDiagram
      class User {
        +String name
        +String email
        +login()
        +logout()
      }

      class Admin {
        +String[] privileges
        +banUser(user: User)
      }

      User <|-- Admin
  `;

  return (
    <div className="prose max-w-none">
      <div className="mermaid">{diagram}</div>
    </div>
  );
}
