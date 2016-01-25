$(document).ready(function(){
    window.kathaa.input_editor_buffer = {}
    window.kathaa.output_editor_buffer = {}

    // What happens when input ports and output ports change
    window.kathaa.edit_module_previous_inport = null;
    $("#kathaa-edit-module-input-tab-ports").on('focus', function(){
        //Store the inport value before change event
        window.kathaa.edit_module_previous_inport = $(this).val();
    }).on('change', function(e){
        var previous_inport_mame = window.kathaa.edit_module_previous_inport;
        var updated_inport_name = $(this).val();

        // Save the current editor value in a buffer temporarily
        // The value from the buffer will be saved into `input_values` if the user decides
        // to save the properties
        // (or automatically saved by design if the user decides to execute the workflow from that node)
        var previous_input_editor_value = window.kathaa.explorer_input_editor.getValue()

        // Initialize parent dicts, if they do not exist
        // much like `mkdir -p` does
        if(window.kathaa.input_editor_buffer == undefined){
            window.kathaa.input_editor_buffer = {}
        }
        if(window.kathaa.input_editor_buffer[
            window.kathaa.latest_node_edit_focus.id] == undefined){

            window.kathaa.input_editor_buffer[
                    window.kathaa.latest_node_edit_focus.id] = {}
        }

        window.kathaa.input_editor_buffer[
            window.kathaa.latest_node_edit_focus.id
            ][
            previous_inport_mame
            ] = previous_input_editor_value


        // Update the input editor instance with the value associated
        // with the updated_inport_name
        // Preferences :
        // input_editor_buffer > latest_workflow_run/sample_sentence (get_node_input_value_at_port)


        var updated_input_editor_value = window.kathaa.input_editor_buffer[
                window.kathaa.latest_node_edit_focus.id
            ][
                updated_inport_name
            ]

        if(updated_input_editor_value == undefined){
            // In case, the value does not exist,
            // obtain the value from get_node_input_value_at_port

            updated_input_editor_value = get_node_input_value_at_port(window.kathaa.latest_node_edit_focus, updated_inport_name);
        }

        //Update value in the editor
        window.kathaa.explorer_input_editor.setValue(updated_input_editor_value);

        //Mark this as the updated previous_inport
        window.kathaa.edit_module_previous_inport = $(this).val();
    })

    window.kathaa.edit_module_previous_outport = null;
    $("#kathaa-edit-module-output-tab-ports").on('focus', function(){
        //Store the outport value before change event
        window.kathaa.edit_module_previous_outport = $(this).val();
    }).on('change', function(e){
        var previous_outport_mame = window.kathaa.edit_module_previous_outport;
        var updated_outport_name = $(this).val();

        // Save the current editor value in a buffer temporarily
        // The value from the buffer will be saved into `output_values` if the user decides
        // to save the properties
        // (or automatically saved by design if the user decides to execute the workflow from that node)
        var previous_output_editor_value = window.kathaa.explorer_output_editor.getValue()

        // Initialize parent dicts, if they do not exist
        // much like `mkdir -p` does
        if(window.kathaa.output_editor_buffer == undefined){
            window.kathaa.output_editor_buffer = {}
        }
        if(window.kathaa.output_editor_buffer[
            window.kathaa.latest_node_edit_focus.id] == undefined){

            window.kathaa.output_editor_buffer[
                    window.kathaa.latest_node_edit_focus.id] = {}
        }

        window.kathaa.output_editor_buffer[
            window.kathaa.latest_node_edit_focus.id
            ][
            previous_outport_mame
          ] = previous_output_editor_value


        // Update the output editor instance with the value associated
        // with the updated_outport_name
        // Preferences :
        // output_editor_buffer > latest_workflow_run/sample_sentence (get_node_output_value_at_port)


        var updated_output_editor_value = window.kathaa.output_editor_buffer[
                window.kathaa.latest_node_edit_focus.id
            ][
                updated_outport_name
            ]

        if(updated_output_editor_value == undefined){
            // In case, the value does not exist,
            // obtain the value from get_node_output_value_at_port

            updated_output_editor_value = get_node_output_value_at_port(window.kathaa.latest_node_edit_focus, updated_outport_name);
        }

        //Update value in the editor
        window.kathaa.explorer_output_editor.setValue(updated_output_editor_value);

        //Mark this as the updated previous_outport
        window.kathaa.edit_module_previous_outport = $(this).val();
    })


    // NOTE
    // Outport Values do not change as of now,
    // If in future, they are made editable for some reason,
    // The change handler will be almost exactly the same
    // as the Inport Values above

    $("#kathaa-edit-module").on('update', function () {
        var component = editor.getComponent(window.kathaa.latest_node_edit_focus.component);
        //Update name and description
        $("#kathaa-explorer-view-label").html(window.kathaa.latest_node_edit_focus.metadata.label);
        $("#kathaa-explorer-view-sublabel").html(window.kathaa.latest_node_edit_focus.component+","+component.version);
        $("#kathaa-edit-module-description").html(component.description);

        //Add metadata editor
        $("#kathaa-edit-node-body").html("");
        $("#kathaa-edit-node-body").append("<div class='editor'></div>");
        var json_editor = new JSONEditor($("#kathaa-edit-node-body .editor")[0]);
        json_editor.set(window.kathaa.latest_node_edit_focus.metadata);
        json_editor.setMode("form");
        window.kathaa.latest_edit_module_json_editor = json_editor;
        window.kathaa.latest_edit_module_target_node = window.kathaa.latest_node_edit_focus;

        // Clear input_editor_buffer and output_editor_buffer when the explorer page is first render
        // This makes the input_editor_buffer values persist only as long as the
        // same instance of explorer page is open
        if(window.kathaa.input_editor_buffer){
            delete window.kathaa.input_editor_buffer[
                    window.kathaa.latest_node_edit_focus.id
                ]
        }
        if(window.kathaa.output_editor_buffer){
            delete window.kathaa.input_editor_buffer[
                    window.kathaa.latest_node_edit_focus.id
                ]
        }

        var component_definition = window.library["core"][window.kathaa.latest_node_edit_focus.component]

        //Render process definitions
        //...only if the type is not kathaa-user-intervention
        if(component_definition['type'] != 'kathaa-user-intervention')
        if(window.kathaa.latest_node_edit_focus.process_definition){
            window.kathaa.explorer_process_definition_editor.setValue(
                    window.kathaa.latest_node_edit_focus.process_definition
                )
        }else{
            window.kathaa.explorer_process_definition_editor.setValue(
                    window.kathaa.process_definitions[
                        window.kathaa.latest_node_edit_focus.component
                    ]
                )
        }

        //Render Input Options and Output Options
        var inports = component_definition.inports
        var inport;
        //Remove all previous options
        $("#kathaa-edit-module-input-tab-ports").html("");

        var _option;
        function add_input_port_option(port, index){
            _option = $('<option>');
            _option.addClass('kathaa-edit-module-input-tab-port');
            _option.val(port.name);
            _option.html(port.name);
            if(_index == 0){
                _option.attr('selected', true);
            }
            $("#kathaa-edit-module-input-tab-ports").append(_option);
        }
        for(var _index in inports){
            inport = inports[_index];
            //Add option for all every available inport
            add_input_port_option(inport, _index);
        }

        //Render corresponding input for node,port pair
        if(inports.length > 0){
            window.kathaa.explorer_input_editor.setValue(
                    get_node_input_value_at_port(
                        window.kathaa.latest_node_edit_focus,
                        inports[0].name
                    )
                )
        }else{
            //Check if the component is sentence_input
            if(window.kathaa.latest_node_edit_focus.component == "core/sentence_input"){
                window.kathaa.explorer_input_editor.setValue(
                        get_node_input_value_at_port(
                            window.kathaa.latest_node_edit_focus,
                            "input_sentence"
                        )
                    )
                add_input_port_option({
                    "name" : "input_sentence"
                }, 0);
            }
        }


        var outports = component_definition.outports;
        var outport;
        //Remove all previous options
        $("#kathaa-edit-module-output-tab-ports").html("");

        var _option;
        function add_output_port_option(port, index){
            _option = $('<option>');
            _option.addClass('kathaa-edit-module-output-tab-port');
            _option.val(port.name);
            _option.html(port.name);
            if(_index == 0){
                _option.attr('selected', true);
            }
            $("#kathaa-edit-module-output-tab-ports").append(_option);
        }
        for(var _index in outports){
            outport = outports[_index];
            //Add option for all every available outport
            add_output_port_option(outport, _index);
            $("#kathaa-edit-module-output-tab-ports").append(_option);
        }

        //Render corresponding output for node,port pair
        if(outports.length > 0){
            window.kathaa.explorer_output_editor.setValue(
                    get_node_output_value_at_port(
                        window.kathaa.latest_node_edit_focus,
                        outports[0].name
                    )
                )
        }else{

            //Check if the component is sentence_output
            if(window.kathaa.latest_node_edit_focus.component == "core/sentence_output"){
                window.kathaa.explorer_output_editor.setValue(
                        get_node_output_value_at_port(
                            window.kathaa.latest_node_edit_focus,
                            "out_ssf"
                        )
                    )
                add_output_port_option({
                    "name" : "sentence_output"
                }, 0);
            }
        }

        //Open Info Tab
        $("#kathaa-edit-module a[href='#kathaa-edit-module-info-tab']").tab('show')
    })

    var sample_sentence = "देश के टूरिजम में राजस्थान एक अहम जगह रखता है।\nबाद में सुरक्षाकर्मियों ने हंगामा कर रहे छात्रों को सभास्थल से बाहर कर दिया.\nइससे पहले प्रधानमंत्री मोदी ने अपने संसदीय क्षेत्र वाराणसी में नई ट्रेन महामना एक्सप्रेस को हरी झंडी दिखाई.\n";
    sample_sentence += sample_sentence;

    window.kathaa.latest_workflow_run = {};
    window.get_node_input_value_at_port =function(node, port){
        // Check in latest_workflow_run,
        // the latest_workflow run saves the input nad output states of all the nodes
        // in the latest workflow execution.
        // its a key value pair, where key is the node_id
        // and value is an object
        //
        // {
        //    "kathaa_inputs" : [Object]
        //    "kathaa_outputs" : [Object]
        // }
        //
        // the `kathaa_inputs` and `kathaa_outputs` objects are again key-value
        // pairs of port_name and known value of the same
        //
        // Sample `kathaa_inputs`:
        //
        // {
        //    "input_port_name_1" : "Known Input Value",
        //    "input_port_name_2" : "Known Input Value",
        // }
        //
        if(window.kathaa.latest_workflow_run[node.id]){
            //Check if kathaa_inputs has a value for the corresponding port
            if(window.kathaa.latest_workflow_run[node.id].kathaa_inputs &&
                window.kathaa.latest_workflow_run[node.id].kathaa_inputs[port]){

                return window.kathaa.latest_workflow_run[node.id].kathaa_inputs[port];
            }else{
                if(node.component == "core/sentence_input" &&
                    port == "input_sentence"){
                    return sample_sentence;
                }
                return "";
            }
        }else{
            // In case of sentence_input, if the user hasnt set a value
            // return sample sentence
            if(node.component == "core/sentence_input" &&
                port == "input_sentence" ){
                return sample_sentence;
            }
            return ""; // Defaults to empty string
        }
    }

    function get_node_output_value_at_port(node, port){
        // Check in latest_workflow_run,
        //
        // Look inside get_node_input_value_at_port function for
        // documentation on the structure and functioning of
        // `latest_workflow_run`


        if(window.kathaa.latest_workflow_run[node.id]){
            //Check if kathaa_inputs has a value for the corresponding port
            if(window.kathaa.latest_workflow_run[node.id].kathaa_outputs &&
                window.kathaa.latest_workflow_run[node.id].kathaa_outputs[port]){

                return window.kathaa.latest_workflow_run[node.id].kathaa_outputs[port];
            }else{
                return "";
            }
        }else{
            return ""; // Defaults to empty string
        }
    }

    window.kathaa.save_module_handler = function(){
        var json_editor = window.kathaa.latest_edit_module_json_editor;
        var updated_node = json_editor.get();
        var target_node = editor.nofloGraph.getNode(window.kathaa.latest_edit_module_target_node.id);
        target_node.metadata = updated_node;
        editor.rerender();
        // $('#kathaa-edit-module').hide();
        set_view('graph-editor');

        //Check if the process_definition has been changed, and needs to be updated
        if(window.kathaa.process_definitions){
            if(window.kathaa.explorer_process_definition_editor.getValue() !=
                window.kathaa.process_definitions[
                        target_node.component
                    ]
                ){
                    target_node.process_definition
                    =
                    window.kathaa.explorer_process_definition_editor.getValue()
            }
        }

        // Update the value from the input and output buffers into
        // latest workflow run

        if(window.kathaa.latest_workflow_run[
                window.kathaa.latest_node_edit_focus.id
            ]){}else{
            window.kathaa.latest_workflow_run[
                window.kathaa.latest_node_edit_focus.id
            ] = {"kathaa_inputs":{}, "kathaa_outputs": {}}
        }

        if(window.kathaa.latest_workflow_run[
            window.kathaa.latest_node_edit_focus.id
        ]["kathaa_inputs"]
            ){}else{
                window.kathaa.latest_workflow_run[
                    window.kathaa.latest_node_edit_focus.id
                ]["kathaa_inputs"] = {};
                window.kathaa.latest_workflow_run[
                    window.kathaa.latest_node_edit_focus.id
                ]["kathaa_outputs"] = {};


        }

        // At this point, the proper parent structure for kathaa_inputs for this node
        // has been created even if it dint exist
        for(_key in window.kathaa.input_editor_buffer[
                        window.kathaa.latest_node_edit_focus.id
                        ]){
            window.kathaa.latest_workflow_run[
                window.kathaa.latest_node_edit_focus.id
            ]["kathaa_inputs"][_key]
            =
            window.kathaa.input_editor_buffer[
                window.kathaa.latest_node_edit_focus.id
            ][_key]
        }
        // Dump the value of the key in the input editor also into
        // latest_workflow run
        window.kathaa.latest_workflow_run[
            window.kathaa.latest_node_edit_focus.id
        ]["kathaa_inputs"][$("#kathaa-edit-module-input-tab-ports").val()]
        =
        window.kathaa.explorer_input_editor.getValue();
window.kathaa.input_editor_buffer
        // At this point, the proper parent structure for kathaa_outputs for this node
        // has been created even if it dint exist
        for(_key in window.kathaa.output_editor_buffer[
                        window.kathaa.latest_node_edit_focus.id
                        ]){
            window.kathaa.latest_workflow_run[
                window.kathaa.latest_node_edit_focus.id
            ]["kathaa_outputs"][_key]
            =
            window.kathaa.output_editor_buffer[
                window.kathaa.latest_node_edit_focus.id
            ][_key]
        }
        // Dump the value of the key in the input editor also into
        // latest_workflow run
        window.kathaa.latest_workflow_run[
            window.kathaa.latest_node_edit_focus.id
        ]["kathaa_outputs"][$("#kathaa-edit-module-output-tab-ports").val()]
        =
        window.kathaa.explorer_output_editor.getValue();


    }
    $("#kathaa-edit-module-save").click(window.kathaa.save_module_handler);

    //Refresh CodeMirror tabs, as updates when they are visible are not rendered by default
    $("a[href='#kathaa-edit-module-input-tab']").on('shown.bs.tab',function(){
        window.kathaa.explorer_input_editor.refresh();
        // Show execute from this node button

        // Show Execute Module only if a user-intervention is not required
        if(!window.kathaa.latest_node_edit_focus.metadata.requiresUserIntervention){
          $("#kathaa-edit-module-execute").removeClass("hidden");
        }
    })
    $("a[href='#kathaa-edit-module-input-tab']").on('hide.bs.tab',function(){
        // window.kathaa.explorer_input_editor.refresh();
        // Hide execute from this node button
        $("#kathaa-edit-module-execute").addClass("hidden");
    })
    $("a[href='#kathaa-edit-module-output-tab']").on('shown.bs.tab',function(){
        window.kathaa.explorer_output_editor.refresh();
    })

    $("a[href='#kathaa-edit-module-process-definition-tab']").on('shown.bs.tab',function(){
        window.kathaa.explorer_process_definition_editor.refresh();
        $("#kathaa-edit-module-execute").removeClass("hidden");
    })
    $("a[href='#kathaa-edit-module-process-definition-tab']").on('hide.bs.tab',function(){
        $("#kathaa-edit-module-execute").addClass("hidden");
    })



    //Instantiated CodeMirror editors
    window.kathaa.explorer_process_definition_editor = CodeMirror.fromTextArea(document.getElementById("kathaa-edit-module-process-definition-tab-code"), {
     lineNumbers: true,
     matchBrackets: true,
     styleActiveLine: true,
     theme:"ambiance"
    });

    window.kathaa.explorer_input_editor = CodeMirror.fromTextArea(document.getElementById("kathaa-edit-module-input-tab-code"), {
     lineNumbers: true,
     matchBrackets: true,
     styleActiveLine: true,
     theme:"ambiance"
    });

    window.kathaa.explorer_output_editor = CodeMirror.fromTextArea(document.getElementById("kathaa-edit-module-output-tab-code"), {
     lineNumbers: true,
     matchBrackets: true,
     styleActiveLine: true,
     theme:"ambiance",
    });

    // //Setup jquery.ime
    // $( 'input, textarea, [contenteditable]' ).ime();
})
