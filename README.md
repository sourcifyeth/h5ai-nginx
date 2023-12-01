# h5ai-nginx Docker

Docker for h5ai project (https://github.com/lrsjng/h5ai)

Used as a Web UI and API for the Sourcify contract repository.

Since there are thousands of folders in a chain folder, displaying all of them takes too long. Hence the nginx config does not allow these routes and redirects to the form under `redirects/`. To build the form page

Use npm v14

```
mkdir redirects
cd select-contract-form
npm install
npm run build
```

This will create the build inside the redirects folder.

Then

```
docker build -t h5ai-nginx .
```

Run with

```
docker run -d -p 10000:80 -v <local-path-to-repository>:/data h5ai-nginx
```

to access the repo at `http://localhost:10000`.

## Troubleshooting

If you on a Mac (or Win) get the following (similar) error

```
Found bindings for the following environments:
    - OS X 64-bit with Node.js 14.x
```

delete the `build` and `node_modules` folders and build the image again. This is because the `node_modules` folder is being copied but it was created with binaries other than linux.
