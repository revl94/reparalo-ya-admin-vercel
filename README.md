<!-- PROJECT LOGO -->
<br />
<p align="center">
    <img src="" alt="Logo" width="280" height="80">
    <h1>Admin Panel - Reparalo Ya</h1>

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#directory-structure">Directory structure</a></li>
      </ul>
    </li>
    <li>
      <a href="#tests">Tests</a>
    </li>
    <li>
      <a href="#documentation">Documentation</a>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

Admin Panel is an administrative application where ReparaloYa administrators can update the content and assets of the
ReparaloYa web page.

### Built With

-   [ReactJs](https://es.reactjs.org/)
-   [Material UI](https://mui.com/)

## Getting Started

### Prerequisites

In order to run the application you must have the following tools installed:

-   **Node 14.12.0 LTS**, you can follow the instructions to install it with [NVM](https://github.com/nvm-sh/nvm)

### Installation

1. Clone the repo

    ```sh
    git clone https://github.com/Reparalo-Ya/reparalo-ya-admin-fe
    ```

2. Locate in the project folder

    ```sh
    cd reparalo-ya-admin-fe/
    ```

3. Install project dependencies

    ```sh
    npm install
    ```

4. Run the development server
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Directory structure

The project has the following structure:

    public
    ├── assets
        ├── images
    src
    ├── assets
    ├── components
    ├── contexts
    ├── hooks
    ├── layout
    ├── services
    ├── store
    ├── styles
    ├── themes
    ├── utils
    ├── views

- public: The `/public` folder containing the index html file.
- assets: The `/assets` folder contains static files.
- components: the `/components` folder contains reusable components.
- contexts: the `/contexts` folder contains react contexts to share data between components in a tree.
- hooks: the `/hooks` folder contains custom hooks.
- services: the `/services` folder contains javascript files with business logic.
- store: the `/store` folder contains redux store and reducers.
- styles: the `/styles` folder contains style sheets.
- themes: the `/themes` folder contains theme definition.
- utils: the `/utils` folder contains all reusable functions.
- views: the `/views` folder contains all applications views.

## Contact

[Reparalo Ya]()

[Daniel Stefanelli]()

[Ramón Vielma]()
