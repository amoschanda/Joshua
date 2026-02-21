#!/usr/bin/env python3
"""
Joshua Dependency Installer
Installs all required dependencies for development on Ubuntu.
"""

import subprocess
import sys
import os

def run_command(cmd, check=True):
    """Run a shell command."""
    print(f"Running: {cmd}")
    result = subprocess.run(cmd, shell=True, check=check)
    return result.returncode == 0

def check_command(cmd):
    """Check if a command exists."""
    return subprocess.run(f"which {cmd}", shell=True, capture_output=True).returncode == 0

def main():
    print("Joshua Dependency Installer")
    print("="*40)
    
    # Check Node.js
    if check_command("node"):
        print("\u2713 Node.js installed")
    else:
        print("Installing Node.js...")
        run_command("curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -")
        run_command("sudo apt-get install -y nodejs")
    
    # Check pnpm
    if check_command("pnpm"):
        print("\u2713 pnpm installed")
    else:
        print("Installing pnpm...")
        run_command("npm install -g pnpm")
    
    # Check Supabase CLI
    if check_command("supabase"):
        print("\u2713 Supabase CLI installed")
    else:
        print("Installing Supabase CLI...")
        run_command("npm install -g supabase")
    
    # Check EAS CLI
    if check_command("eas"):
        print("\u2713 EAS CLI installed")
    else:
        print("Installing EAS CLI...")
        run_command("npm install -g eas-cli")
    
    # Install project dependencies
    print("\nInstalling project dependencies...")
    os.chdir(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    run_command("pnpm install")
    
    print("\n" + "="*40)
    print("Setup complete!")
    print("\nNext steps:")
    print("1. Copy .env.example to .env and fill in your credentials")
    print("2. Run 'pnpm dev' to start development")

if __name__ == "__main__":
    main()
