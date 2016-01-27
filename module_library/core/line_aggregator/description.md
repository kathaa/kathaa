This is an example implementation of a `kathaa-blob-adapter`   

`kathaa-blob-adapters` operate on a bunch of blobs, in contrast to the general modules which operate on a single blob. The purpose of `kathaa-blob-adapters` is to modify the size and structure of blobs based on certain conditions.   

For example, this `blob-adapter` "implodes" ever blob into new blobs based by adding the delimiter. 

This is basically used to combine blobs "exploded" with the `line_splitter` module
 
