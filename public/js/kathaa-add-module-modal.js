function init_add_module_modal() {
    var data = [];
    $.each(window.library, function(key, value){
        $.each(value, function(key, value){
            data.push([key, value["name"], value["version"],value["short_description"]]);
        })

    })

    var table;
    if ( $.fn.dataTable.isDataTable( '#kathaa-modules-table' ) ) {
        table = $('#kathaa-modules-table').DataTable();
    }else{
        table = $('#kathaa-modules-table').DataTable({
        data: data,
        scrollY: "400px",
        scrollCollapse: true,
        paging:         true,
        columnDefs: [
            {
                "render": function ( data, type, row ) {
                    if(data == "core/sentence_input"){
                        return "<i class='text-warning'>"+data+"</i>" ;
                    }else if(data == "core/sentence_output"){
                        return "<i class='text-info'>"+data+"</i>" ;
                    }
                    return "<i class='text-success'>"+data+"</i>" ;
                },
                "targets": 1
            },
            { "visible": false,  "targets": [ 0 ] }
         ]
        });
    }


    $('#kathaa-modules-table tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
        var data = table.row(this).data();
        add_module_to_graph(data[0]);
        $('#kathaa-add-module').hide();
    });
}

function validate_module_addition(editor,component_name){
    // Only one sentence_input module allowed
    if(component_name == "core/sentence_input"){
        for(var i=0;i<editor.nofloGraph.nodes.length; i++){
            if(editor.nofloGraph.nodes[i].component == "core/sentence_input"){
                var _result = {}
                _result.success = false;
                _result.message = "Only one Sentence_Input module is allowed in the workflow."

                return _result;
            }
        }
    }
    return {success:true};
}
function add_module_to_graph(component_name){
    var validation = validate_module_addition(editor, component_name);
    if(validation.success == false){
        toastr.options = {
            closeButton: true,
            progressBar: true,
            showMethod: 'slideDown',
            timeOut: 2000
        };
        toastr.error(validation.message, 'Unable to Add Module');
        return;
    }

    var id = component_name+"_"+Math.round(Math.random()*100000).toString(36);

    var metadata = {
        label: component_name,
        x: Math.round(Math.random()*800),
        y: Math.round(Math.random()*600)
    };

    if(window.kathaa.addNodePositionKnown){
        metadata.x = window.kathaa.last_menu_position.x;
        metadata.y = window.kathaa.last_menu_position.y;
    }

    // metadata = TheGraph.merge(metadata, editor.getComponent(component_name).metadata);
    for(var _key in editor.getComponent(component_name).metadata){
        if(_key=="x" || _key=="y"){
            //Do Nothing
        }else{
            metadata[_key] = editor.getComponent(component_name).metadata[_key];
        }
    }
    return editor.nofloGraph.addNode(id, component_name, metadata);
}
