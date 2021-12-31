// --------------------------------------------------------- \\
// Leer de fichero
// --------------------------------------------------------- \\

var fichero = document.getElementById('archivo')
var documentos_fichero = []

fichero.addEventListener('change', function(e) {
var reader = new FileReader();
reader.onload = function () {
    var lineas = reader.result.toString()
    documentos_fichero = lineas.split("\r\n")

    document.getElementById("visualizer").innerHTML = `<pre>${lineas}</pre>`
}
reader.readAsText(fichero.files[0]);

    
}, false)

// --------------------------------------------------------- \\
// Función principal
// --------------------------------------------------------- \\

function generar() {
    var result = tablas(documentos_fichero)
    imprimir(result)
    var similitudes = matriz_similitudes(result)
    imprimir_similitudes(similitudes)
}

// --------------------------------------------------------- \\
// Construir todas tablas para cada documento
// --------------------------------------------------------- \\

function tablas(documentos) {
    var result = [];
    for (var i = 0; i < documentos.length; i++){
        result[i] = hacer_tabla(documentos[i],documentos)
    }
    return result
}
// --------------------------------------------------------- \\
// Construir tabla para un documento
// --------------------------------------------------------- \\

function hacer_tabla(documento,documentos){

    // Documento con duplicados
    var array = limpiar(documento)

    // ÍNIDICE (documento sin duplicados)
    var terminos = [...new Set(array)] 

    // TF
    var TF = hacer_TF(array,terminos)
    
    // IDF
    var N = documentos.length
    var IDF = hacer_IDF(terminos,documentos,N)

    // TF-IDF
    var TF_IDF = hacer_TF_IDF(TF,IDF)

    var result = {
        terminos: terminos,
        TF: TF,
        IDF: IDF,
        TF_IDF: TF_IDF
    }

    return result
}

// --------------------------------------------------------- \\
// Funciones auxiliares
// --------------------------------------------------------- \\
function limpiar(documento) {
    var result = ""
    var regex = /[.,]/g;

    var limpio = documento.replace(regex, '').toLowerCase();
    result = limpio.split(' ')
    return result;
}

function hacer_TF(documento, indice){
    var result = []
    for (var i = 0; i < indice.length; i++){
        var count = documento.filter(x => x == indice[i]).length;
        result[i] = count
    }

    return result;
}

function hacer_IDF(indice,documentos, N){
    var result = []
    for (var i = 0; i < indice.length; i++){
        var termino = indice[i]
        var dfx = 0
        for (var j = 0; j < N; j++){
            var actual = documentos[j]
            actual = limpiar(actual)
            if (actual.includes(termino)){
                dfx++
            }
        }
        var aux = Math.log10(N / dfx)
        aux = Math.round(aux *100)/100
        result[i] = aux
    }

    return result;
}

function hacer_TF_IDF(TF,IDF){
    var result = [];
    for (var i= 0; i < TF.length; i++) {
        result[i] = (TF[i]*IDF[i])
    }
    return result
}
// --------------------------------------------------------- \\
// Similitud coseno
// --------------------------------------------------------- \\

function matriz_similitudes(tablas){
    var result = [];
    for (var i= 0; i < tablas.length; i++) {
        var fila = []
        var a = tablas[i]
        for (var j= 0; j < tablas.length; j++) {
            var b = tablas[j]
           if (j==i){
            fila[j] = "══"
           } else {
            fila[j] = similitud(a,b)
           }
            
        }
        result.push(fila)
    }
    return result
}

function similitud(arr1,arr2){
    var result = 0
    var a = normalizar(arr1.TF)
    var b = normalizar(arr2.TF)
    var sum = 0
    for (var i= 0; i < a.length; i++) {
        var elemento_actual = arr1.terminos[i]
        const elemento_coincidente = (element) => element === elemento_actual;
        var indice_comparar = arr2.terminos.findIndex(elemento_coincidente)
        if (indice_comparar != -1) {
            var aux = a[i]*b[indice_comparar]
            sum = sum + aux
        }
    }
    result = Math.round(sum *100)/100
    return result
}


function normalizar(arr){
    var result = []

    //calcular longitud
    var longitud = 0
    for (var i= 0; i < arr.length; i++) {
        longitud = longitud + Math.pow(arr[i], 2)
    }
    longitud = Math.sqrt(longitud)

    //Normalizar
    for (var i= 0; i < arr.length; i++) {
        aux = 1+Math.log10(arr[i])
        aux = aux/longitud
        result[i] = aux
    }
    return result
}

// --------------------------------------------------------- \\
// Mostrar datos
// --------------------------------------------------------- \\

function imprimir(tablas){
    for(var i=0; i < tablas.length; i++) {
        var tabla_actual = tablas[i];
        document.getElementById("salida").innerHTML += `
        <h1>Documento ${i+1}</h1>
        `;

        document.getElementById("salida").innerHTML += `
        <div class="container">
            <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Índice del término</th>
                    <th scope="col">Término</th>
                    <th scope="col">TF</th>
                    <th scope="col">IDF</th>
                    <th scope="col">TF-IDF</th>
                  </tr>
                </thead>
                <tbody id="elementos_tabla${i}">
                </tbody>
                </table>
        </div>
        `;

        for (var j = 0; j < tabla_actual.terminos.length; j++) {
            var id_actual = "elementos_tabla"+i
            document.getElementById(id_actual).innerHTML += `
                <tr>
                    <th scope="row">${j+1}</th>
                    <td>${tabla_actual.terminos[j]}</td>
                    <td>${tabla_actual.TF[j]}</td>
                    <td>${tabla_actual.IDF[j]}</td>
                    <td>${tabla_actual.TF_IDF[j]}</td>
                </tr>
            `;
        }
                
    }
}

function imprimir_similitudes(similitudes){

    document.getElementById("similitudes").innerHTML += `
        <h1>Matriz de similitudes</h1>
        `;

        document.getElementById("similitudes").innerHTML += `
        <div class="container">
            <table class="table">
                <thead>
                  <tr id="filas">
                  <th scope="row"> </th>
                  </tr>
                </thead>
                <tbody id="columnas">
                </tbody>
                </table>
        </div>
        `;

    for(var i=0; i < similitudes.length; i++) {
        var sim_actual = similitudes[i];
        document.getElementById("filas").innerHTML += `
                <tr>
                    <th scope="row">Documento ${i+1}</th>
                </tr>
            `;
        document.getElementById("columnas").innerHTML += `
                <tr id="fila${i+1}">
                    <th scope="row">Documento ${i+1}</th>
                </tr>
            `;
        for (var j = 0; j < sim_actual.length; j++) {
            var id_actual="fila"+(i+1)
            document.getElementById(id_actual).innerHTML += `
                    <td>${sim_actual[j]}</td>
            `;
        }
                
    }
}