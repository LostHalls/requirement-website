# Lost Halls Raid Requirement Checker
This tool is designed to help players of Realm of the Mad God (RotMG) calculate gear requirements for participating in Discord runs.

It can check for each character based on IGN whether it has sufficient gear for an exalted lost halls server run (8/8 + other requirements) and a separate convenient interface for selecting your character's equipment and automatically calculating if your setup meets the raid requirements.

# Prerequisites
- [Node.js 20.*](https://nodejs.org/en/download)
- [Requirement Website API Server](https://github.com/LostHalls/requirement-website-api)

# Setup Steps
## Install Main App Dependencies
Navigate to the root folder of your React app and run:
```sh
npm install
```

## Setup Environment Variables
Copy `.env_template` to `.env`

Make sure the api endpoint at `VITE_USER_FETCH_LOCATION` matches your api server, such as if you've changed the port or are not hosting locally

By default Vite runs on port `5173` -- if you wish to change this, set an environment variable `REQWEB_PORT` with the port you wish to use

## Run the Main App
This requires the `Requirement Website API Server` to be running.
```sh
npm run dev
```

Access the project locally at [http://localhost:5173/](http://localhost:5173/) when running with Vite.

## Build the Main App
```sh
npm run build
```


## Code Styling with Prettier
This project uses [Prettier](https://prettier.io) for code formatting. Ensure Prettier is set up in your editor for auto-formatting or run `npx prettier --write .` before commits (or not).


## Disclaimer
This app is not officially endorsed or affiliated with Realm of the Mad God, Deca Games, or any related entities. All images, data, and other content related to Realm of the Mad God used within this app are the property of their respective copyright owners. This app is intended for educational and informational purposes only, under fair use guidelines. We do not claim ownership of any copyrighted materials used in this app.

This project is hosted on [GitHub Pages](https://pages.github.com/).

## License
This project is made available under the MIT License. See the [LICENSE](LICENSE) file for more details. Please note that while this license applies to the code, it does not grant rights to use copyrighted materials owned by others. Users of this tool are responsible for ensuring their compliance with all relevant copyright laws and regulations.