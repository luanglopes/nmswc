# NMSWC

This is a package to use swc and nodemon for a development server. To configure it you can use either nodemon.json or nmswcrc.json and .swcrc config files.

## Install

to install it run

```
npm i -D nmswc
```

## Usage

To use it, create a script like this on your package.json:

```
{
  ...
  "scripts": {
    "dev": "nmswc <path_to_file>"
  }
}
```

Then run:

```
npm run dev
```
