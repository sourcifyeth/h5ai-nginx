# h5ai-nginx Docker

> ⚠️⚠️⚠️ **DEPRECATION WARNING** ⚠️⚠️⚠️  
>  
> **Sourcify no longer uses h5ai as its repo interface!**  
> Please refer to the new repository: 👉 [https://github.com/sourcifyeth/repo.sourcify.dev](https://github.com/sourcifyeth/repo.sourcify.dev)

---

Docker for h5ai project: [https://github.com/lrsjng/h5ai](https://github.com/lrsjng/h5ai)

Used as a Web UI and API for the Sourcify contract repository.

Since there are thousands of folders in a chain folder, displaying all of them takes too long. Hence, the nginx config does not allow these routes and redirects to the form under `redirects/`. To build the form page:

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
docker run -d -e SOURCIFY_SERVER='<server-url>' SERVER_PATH_PREFIX='<path-prefix>' -p 10000:80 -v <local-path-to-repository>:/data h5ai-nginx
```

Note that `<server-url>` must be the URL of your Sourcify server without the path prefix. So it can be `http://sourcify.dev` but not `http://sourcify.dev/server`. If you want to add a path prefix, set the env variable `SERVER_PATH_PREFIX`.

```bash
SOURCIFY_SERVER=http://sourcify.dev
SERVER_PATH_PREFIX=/server
```

to access the repo at `http://localhost:10000`.

## Troubleshooting

If you on a Mac (or Win) get the following (similar) error

```
Found bindings for the following environments:
    - OS X 64-bit with Node.js 14.x
```

delete the `build` and `node_modules` folders and build the image again. This is because the `node_modules` folder is being copied but it was created with binaries other than linux.
