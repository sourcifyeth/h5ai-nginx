# h5ai Docker

Docker for h5ai project (https://github.com/lrsjng/h5ai)

Used as a Web UI and API for the Sourify contract repository.

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
docker-compose up
```
