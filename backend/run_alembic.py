#!/usr/bin/env python3
"""Script to run Alembic migrations."""

import sys
import os
from alembic.config import Config
from alembic import command

def main():
    alembic_cfg = Config("alembic.ini")
    
    if len(sys.argv) < 2:
        print("Usage: python run_alembic.py <command> [args...]")
        print("Commands: revision, upgrade, downgrade, history")
        return
    
    cmd = sys.argv[1]
    
    try:
        if cmd == "revision":
            autogenerate = "--autogenerate" in sys.argv
            message = None
            if "-m" in sys.argv:
                message_idx = sys.argv.index("-m") + 1
                if message_idx < len(sys.argv):
                    message = sys.argv[message_idx]
            
            command.revision(alembic_cfg, message=message, autogenerate=autogenerate)
            
        elif cmd == "upgrade":
            revision = sys.argv[2] if len(sys.argv) > 2 else "head"
            command.upgrade(alembic_cfg, revision)
            
        elif cmd == "downgrade":
            revision = sys.argv[2] if len(sys.argv) > 2 else "-1"
            command.downgrade(alembic_cfg, revision)
            
        elif cmd == "history":
            command.history(alembic_cfg)
            
        else:
            print(f"Unknown command: {cmd}")
            
    except Exception as e:
        print(f"Error running alembic command: {e}")

if __name__ == "__main__":
    main()