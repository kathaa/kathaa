This is a generic merger for SSF, which `soft-merges` two similar SSF files. This is meant for quick prototyping, please build on top of this module, for your more specific use cases.

Assumptions
-----------
The key assumption in this soft merger, is the ordering of the nodes will not change in *similar* SSF files of the same sentence. So this will not work
if the SSF files are very different from each other. For your custom cases, we would encourage you to modify the code of this merger as you please.

Inputs
------
* `in_ssf_1` : This SSF data will provide the structure to the merged output
* `in_ssf_2` : The properties of all nodes from this SSF file will be merged onto the existing structure of the `in_ssf_1` file

Outputs
-------
* `out_ssf` : This is the final merged SSF data
