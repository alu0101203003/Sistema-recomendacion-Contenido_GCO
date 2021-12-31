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
Las similitudes son calculadas en forma de matriz relacionando cada documento con el resto:

```
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
```

Y por último se hace uso de las funciones de imprimir que se encargan de manipular el código html de manera que se muestren los datos deseados de manera corecta.

### Ejemplo de uso

Para usar el programa hará falta un fichero .txt como el siguiente:
```
Aromas include tropical fruit, broom, brimstone and dried herb. The palate isn't overly expressive, offering unripened apple, citrus and dried sage alongside brisk acidity.
This is ripe and fruity, a wine that is smooth while still structured. Firm tannins are filled out with juicy red berry fruits and freshened with acidity. It's  already drinkable, although it will certainly be better from 2016.
Tart and snappy, the flavors of lime flesh and rind dominate. Some green pineapple pokes through, with crisp acidity underscoring the flavors. The wine was all stainless-steel fermented.
Pineapple rind, lemon pith and orange blossom start off the aromas. The palate is a bit more opulent, with notes of honey-drizzled guava and mango giving way to a slightly astringent, semidry finish.
Much like the regular bottling from 2012, this comes across as rather rough and tannic, with rustic, earthy, herbal characteristics. Nonetheless, if you think of it as a pleasantly unfussy country wine, it's a good companion to a hearty winter stew.
Blackberry and raspberry aromas show a typical Navarran whiff of green herbs and, in this case, horseradish. In the mouth, this is fairly full bodied, with tomatoey acidity. Spicy, herbal flavors complement dark plum fruit, while the finish is fresh but grabby.
Here's a bright, informal red that opens with aromas of candied berry, white pepper and savory herb that carry over to the palate. It's balanced with fresh acidity and soft tannins.
This dry and restrained wine offers spice in profusion. Balanced with acidity and a firm texture, it's very much for food.
Savory dried thyme notes accent sunnier flavors of preserved peach in this brisk, off-dry wine. It's fruity and fresh, with an elegant, sprightly footprint.
This has great depth of flavor with its fresh apple and pear fruits and touch of spice. It's off dry while balanced with acidity and a crisp texture. Drink now.
```

Se cargará el archivo y, pulsando el botón de generar se mostrarán todos los datos necesarios.

Aquí se enlazan [ejemplos de análisis con diferentes documentos](https://github.com/alu0101203003/Sistema-recomendacion-Contenido_GCO/tree/main/analisis)
