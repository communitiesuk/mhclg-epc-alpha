# EPC Alpha

## Environment reqs

To build/run site you need:

- [Hugo](https://gohugo.io)
- [Node](https://nodejs.org/en/) and [Npm](https://www.npmjs.com/)
- [Gulp](https://gulpjs.com/)


## The generated output is deployed via a github pages repo at [https://communitiesuk.github.io/mhclg-epc-alpha/](https://communitiesuk.github.io/mhclg-epc-alpha/)


## Development

To develop the site locally, run:

- `npm run start` to generate css, start gulp watch task and run hugo server in the background

## Creating content

See [creating content](CREATE-CONTENT.md) documentation.
Home page content is store in `themes/govuk/layouts/index.html`
Page content is `content` folder
Header menu proposition links are set in `config.toml`

## Deploy of site

Deploy manually by running `hugo` in the terminal (this publishes the site to teh docs folder inthe main repo), then committing the repo.
