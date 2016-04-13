# Humanlink's Frontend

This is a mirror of the code that is running Humanlink's frontend.

The main purpose of this is to keep the development process of backend and 
static frontend development separate.

## What exactly is "frontend"?

Right now, frontend refers to static files only, such as:
* JavaScript code
* Images
* Stylesheets
* AngularJS partials located in `views/*/partials`

Unfortunately, Jinja templates should be changed in the main humanlink2 repository.
This can be addressed in the future.

## Dependencies and Setup

Pretty much the same as before, please go through: 
[Requirements-and-Dev-Environment](https://github.com/CareTiger/HumanLink/wiki/Requirements-and-Dev-Environment)

To run:
```bash
$ ./bin/hl deploy dev
```

## Hosts

If you have the backend code running locally, modify the `BACKEND` variable in
`app.yaml`:

```
env_variables:
  BACKEND: 192.168.59.103:8080
```

The above code assumes the backend code is running on Docker with boot2docker
and is exposed at port 8080. Please modify this value if you're not using
boot2docker or have different settings.

## Keeping in Sync

Make sure changes that here are merged also are merged (manually) into 
[humanlink2](https://github.com/CareTiger/humanlink2). You only need to do
this if you want the front changes to take in the production site 
(e.g http://eb.humanlink.co/).
Otherwise, https://humanlink-frontend.appspot.com/ is automatically
updated when this repository is updated.

Eventually, this process can either be automated, or humanlink2 can `git submodule`
necessary directories from this repository.

The following files and directories files need to be kept in sync with
humanlink2/alpha:

* app/
* assets/
* views/
* bower.json
* gulpfile.js
* package.json

You can simply select them all at once, and copy paste to the other
directory. Git should take care of the rest.
