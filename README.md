# init Project

```bash
    npm init -y
```

# install packages

## new .npmrc

```bash
registry=https://registry.npmmirror.com/
ELECTRON_MIRROR=http://npmmirror.com/mirrors/electron/
```

```bash
    npm install electron @electron-forge/cli --save-dev
```

# init electron-forge

```bash
    npm install nrm -g
    nrm use taobao
    npx electron-forge import
```

# package exe for windows

```bash
    npm run build && npm run electron:make
```
