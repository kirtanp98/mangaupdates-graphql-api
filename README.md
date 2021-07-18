# Mangaupdates GraphQL Api
![build badge](https://github.com/kirtanp98/mangaupdates-graphql-api//actions/workflows/integrate.yml/badge.svg)
![GitHub package.json version](https://img.shields.io/github/package-json/v/kirtanp98/mangaupdates-graphql-api?color=blue)
![GitHub](https://img.shields.io/github/license/kirtanp98/mangaupdates-graphql-api)



## About The Project

Mangaupdates (Baka-Updates Manga) has one of the most vast amount of information on different series, scanlations groups, authors and etc. However, getting usable information from the website is hard and requires people to scrape.

Note:
We are not affilated with mangaupdate.com.

### Built With

* [NestJS](https://nestjs.com/)
* [Puppeteer](https://pptr.dev/)

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

* node
* npm
* redis
  * Why don't you use docker to make it easier for people to install redis?
    * I'm not running the redis container on where I deploy the nestjs application, but I should really make use of it. It will probably be easier for people to use.

### Installation

1. Clone the repo
   ```sh
   $ git clone https://github.com/kirtanp98/mangaupdates-graphql-api.git
   ```
2. Install NPM packages
   ```sh
   $ npm install
   ```
3. Install Redis

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Contributing

I'm open to any contributions that will improve the app, add new feature, or fix any bugs. Contributions you make are **greatly appreciated** and recommended :).
Just fork the repo, make a new branch and open a pull request.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Kirtan Patel - [@Kirtanisnothere](https://twitter.com/Kirtanisnothere)

Project Link: [https://github.com/kirtanp98/mangaupdates-graphql-api](https://github.com/kirtanp98/mangaupdates-graphql-api)


