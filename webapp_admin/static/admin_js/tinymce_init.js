var tmce_id;
var tmce_value;
var tmce_type;
var tmce_win;
var tmfb_win;



function FileBrowser(id, value, type, win) {
    // Do custom browser logic
//    var url = '/site_media/images/tnwa_logo.png';
//    var fieldElm = win.document.getElementById(id);
//    fieldElm.value = url;
    var cmsURL = '/admin/filebrowser/browse/?pop=2';
    cmsURL = cmsURL + '&type=' + type;

    tmce_id = id;
    tmce_value = value;
    tmce_type = type;
    tmce_win = win;

    tmfb_win = tinymce.activeEditor.windowManager.open({
        url: cmsURL,
        title:'Choose or Upload a File',
        resizable:true,
        scrollbars:true,
        maximizable:true,
        width: 940,
        height: 600
        },{
        window: win,
        input: value,
        editor_id: id });
}


tinymce.init({
    selector: "textarea",
    theme: "modern",
    plugins: [
        "template advlist autolink lists link image charmap hr anchor",
        "searchreplace wordcount visualblocks visualchars code fullscreen",
        "insertdatetime media nonbreaking table contextmenu directionality textcolor",
    ],
    menubar: "edit insert view format table tools",
    toolbar1: "template insertfile undo redo | styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | media",
    image_advtab: true,
    content_css:'/static/admin_css/editor.css?v=4',
    width: "98%",
    height: 500,
    file_browser_callback : FileBrowser,
    image_dimensions: false,
    style_formats : [
        {title : 'Header 1', block : 'h1'},
        {title : 'Header 2', block : 'h2'},
        {title : 'Header 3', block : 'h3'},
        {title : 'Header 4', block : 'h4'},
        {title : 'Header 5', block : 'h5'},
        {title : 'Header 6', block : 'h6'},
        {title : 'Div', block: 'div'},
        {title : 'Paragraph', block: 'p'},
        {title : 'Alpha List', selector: 'ol', styles: {'list-style-type': 'lower-alpha'}},
        {title : 'Button', selector: 'a', classes: 'btn'},
        {title : 'Dialog Link', selector: 'a', classes: 'dialog-link'}
    ],
    extended_valid_elements : 'iframe[src|title|width|height|allowfullscreen|frameborder|webkitallowfullscreen|mozallowfullscreen],',
    templates: [
        {'title': '1 Column', 'description': '1 Full Width Column.',
            'url': '/static/tinymce_templates/one_col.html'},
        {'title': '2 Column', 'description': '2 Equal Columns',
            'url': '/static/tinymce_templates/2-col.html'},
        {'title': '2 Column w/ Contact Form', 'description': '2 Equal Columns w/ a Contact Form on the Right',
            'url': '/static/tinymce_templates/2-col_contact.html'},
        {'title': '3 Column', 'description': '3 Equal Columns',
            'url': '/static/tinymce_templates/3-col.html'},
        {'title': '4 Column', 'description': '4 Equal Columns',
            'url': '/static/tinymce_templates/4-col.html'},
        {'title': '2 Column Wide Right', 'description': 'One Skinny Column & One Wide Column',
            'url': '/static/tinymce_templates/wide_col_right.html'},
        {'title': '2 Column Wide Left', 'description': 'One Skinny Column & One Wide Column',
            'url': '/static/tinymce_templates/wide_col_left.html'},
    ],
    visualblocks_default_state: true,
    paste_as_text: true,
    paste_data_images: true,
    browser_spellcheck: true,
});
