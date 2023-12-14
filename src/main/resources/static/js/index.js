$(document).ready(function () {
    $('#folderPaths').on('click', 'a.breadcrumb', function() {
        const path = $(this).attr('data-path');

        updateFolderContents(path);
    });

    updateFolderContents('/');
});

function updateFolderContents(path) {
    toggleLoader(false);

    $.ajax({
        url: '/api/viewFolder?path=' + encodeURIComponent(path),
        method: 'GET',
        contentType: 'application/json',
        success: function(data) {
            updateBreadcrumbs(path);
            renderFilesList(data, path);
            toggleLoader(true);
        },
        error: function() {
            toggleLoader(true);
            return M.toast({html: 'Failed to fetch the files'});
        }
    });
}

function updateBreadcrumbs(path) {
    const pathParts = path.split('/');

    const cleanedPathParts = pathParts.filter(Boolean).join('/').replace(/\/+/g, '/').split('/');

    const breadcrumbsContainer = $('#folderPaths');
    breadcrumbsContainer.empty();

    initRootItem();
    const currentPath = [];
    cleanedPathParts.forEach(function(part, index) {
        currentPath.push(part);

        const breadcrumb = $(`<a style="cursor: pointer" class="breadcrumb"></a>`).text(part);

        breadcrumb.attr('data-path', '/' + currentPath.join('/'));
        breadcrumbsContainer.append(breadcrumb);
    });
}

function initRootItem () {
    const breadcrumbsContainer = $('#folderPaths');
    const breadcrumb = $(`<a style="cursor: pointer" class="breadcrumb"></a>`).text('/');

    breadcrumb.attr('data-path', '/');
    breadcrumbsContainer.append(breadcrumb);
}

function toggleLoader (show) {
    const filesListCol = $('#filesListCol');
    const fileLoader = $('#fileLoader');

    if (show) {
        filesListCol.css('display', '');
        fileLoader.css('display', 'none');
    } else {
        filesListCol.css('display', 'none');
        fileLoader.css('display', '');
    }
}

function renderFilesList (files, path) {
    const filesListCol = $('#filesListCol');
    filesListCol.empty();

    const emptyDir = $('#emptyDir');
    if (files.length === 0) {
        emptyDir.css('display', '');
        filesListCol.css('display', 'none');
        $('#filesListDIV').css('display', 'none');
    } else {
        emptyDir.css('display', 'none');
        filesListCol.css('display', '');
        $('#filesListDIV').css('display', '');
    }

    files.forEach(function (file) {
        const elementId = file.filename;

       const fileElement = $(`
    <li style="cursor: pointer" id="${elementId}" class="collection-item avatar">
      <i class="material-icons circle">${file.type}</i>
      <span class="title">${file.filename}</span>
      <p>${file.type}<br>
         Size: ${file.size}
      </p>
      <a class="secondary-content"><i class="material-icons">arrow_forward</i></a>
    </li>`);

       fileElement.on('click', function () {
           if (file.type === 'file') {
               return M.toast({html: 'This is a file.'})
           }

           updateFolderContents(getFilePath(path, file.filename));
       })

        filesListCol.append(fileElement);
    });
}

function getFilePath (path, fileName) {
    return path.replace(/\/$/, '') + '/' + fileName;
}