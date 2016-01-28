This is an example implementation of a `kathaa-blob-adapter`   

`kathaa-blob-adapters` operate on a bunch of blobs, in contrast to the general modules which operate on a single blob. The purpose of `kathaa-blob-adapters` is to modify the size and structure of blobs based on certain conditions.   

This `kathaa-blob-adapter` "squashes" all blobs into a single blobs. This is useful in case of evaluation modules which would want to have a look at the whole processed data in a single go.