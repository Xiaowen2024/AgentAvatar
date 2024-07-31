# Project Setup and Execution Guide

This guide provides instructions to set up and run the Node.js and Python servers, initialize agents, and start a conversation action.

## Prerequisites

Ensure you have the following installed:

- **Node.js** and **npm** (or **npx** for running commands)
- **Python 3**
- Required dependencies:
  - Run `npm install` to install Node.js dependencies.
  
Start convex 
- Run `npm install convex dotenv` to install the Convex client and server library
- Run `npx convex deploy` to deploy recent changes
- Run `npx convex dev` to set up a Convex dev deployment


## Running the Node.js Server

To start the Node.js server using TypeScript, execute the following command:

```bash
npx tsx server.ts

## Running the Python Server

To start the Python server, use the following command:

```bash
python3 util/pythonServer.py

## Initialize Agents
npx tsx tests/initializeAgents.ts

## Initialize Agents
npx tsx tests/startConversationMessageAction.ts
