# Sistemas de recomendación. Modelos Basados en el Contenido
## Rauúl Martín Rigor - alu0101203003

### Descripción del código
El objetivo de esta práctica es implementar un sistema de recomendación siguiendo el modelo basados en el contenido.

Pasos:

* Estudiar los modelos basados en el contenido. En las diapositivas de clase hay ejemplos sobre este campo.

* Crear un software que reciba por línea de comandos:

* Archivo de texto plano con extensión .txt. Cada documento viene representado en una línea del archivo. Ejemplos.

El software proporcionará la siguiente salida:

* Una tabla con los siguientes atributos para cada documento
	* Índice del término.
	* Término.
	* TF.
	* IDF.
	* TF-IDF.

* Similaridad coseno entre cada par de documentos.


La tecnología escogida para la implementación ha sido una combinación de JavaScript y HTML5.

#### Código 

Se compone de una función principal que llama a la ejecución de las demás al accionar el botón de generar:

```
// --------------------------------------------------------- \\
// Función principal
// --------------------------------------------------------- \\

function generar() {
    var result = tablas(documentos_fichero)
    imprimir(result)
    var similitudes = matriz_similitudes(result)
    imprimir_similitudes(similitudes)
}
```

Se construirán las tablas para cada documento (llamando a su vez a la función auxiliar diseñada para cada atributo en concreto):

```
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
```

### Ejemplo de uso

