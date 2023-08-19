import zlib from "zlib";

export default (stream, options) => {
    if (!stream) {
        throw new TypeError('argument stream is required')
    }

    const defaultOptions = {
        supportedEncodings: [ 'gzip', 'deflate', 'gzip, deflate' ],
        identityEncodings: [ 'identity' ],
    }
    options = { ...defaultOptions, ...options }


    const encoding = stream.headers?.['content-encoding'] || 'identity';

    if (options.identityEncodings.includes(encoding)) return stream
    if (!options.supportedEncodings.includes(encoding)) {
        const error = new Error(`Unsupported Content-Encoding: ${ encoding }`)
        error.status = 415
        throw error
    }
    return stream.pipe(zlib.createUnzip(options.unzip))
};

