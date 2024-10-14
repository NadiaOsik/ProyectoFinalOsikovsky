// Variables
const form = document.getElementById("form");
const mainContainer = document.getElementById("main-container");
const tablaResultados = document.getElementById("tablaResultados");
const notas = document.querySelectorAll(".notas");
const btnsMaterias = document.querySelectorAll(".btn");
const cntMaterias = document.querySelector(".cnt-materias");
const cntForm = document.querySelector(".cnt-form");
const nombre = document.getElementById("nombre");
const cntResultados = document.querySelector(".cnt-resultados");
const cntVolver = document.getElementById("cntVolver");
const btnMejorAlumno = document.getElementById("btnMejorAlumno");
const btnBorrarTodo = document.getElementById("btnBorrarTodo");
const mostrarMejoresAlumnos = document.querySelector(".mejor-alumno");
const errorNombre = document.getElementById("errorNombre");
const errorNota1 = document.getElementById("errorNota1");
const errorNota2 = document.getElementById("errorNota2");
const errorNota3 = document.getElementById("errorNota3");
const cargaJSON = document.getElementById("cargaJSON");
const nota1 = document.getElementById("nota1");
const nota2 = document.getElementById("nota2");
const nota3 = document.getElementById("nota3");
let listadoAlumnos = [];
let backupJSON = [];
let classMateria = "";

// Objeto Alumnos
class Alumnos {
    constructor (nombre,nota1,nota2,nota3,materia) {
        this.nombre = nombre;
        this.nota1 = parseFloat(nota1);
        this.nota2 = parseFloat(nota2);
        this.nota3 = parseFloat(nota3);
        this.materia = materia;
        this.promedio = Math.round((this.nota1 + this.nota2 + this.nota3) / 3);
    }
}

// Función que valida que se ingresó un nro del 1 al 10
function validarNota(nota) {

    if (isNaN(nota.value) || nota.value < 1 || nota.value == "" || nota.value > 10) {

        if (nota.id === nota1.id) {
            errorNota1.innerText = "Debe ingresar un número del 1 al 10";
        } 
        if (nota.id === nota2.id) {
            errorNota2.innerText = "Debe ingresar un número del 1 al 10";
        } 
        if (nota.id === nota3.id) {
            errorNota3.innerText = "Debe ingresar un número del 1 al 10";
        } 
        nota.style.borderColor = "red";

    } else {
        borrarErrorNota(nota);
        return nota.value;
    }

}

// Función que valida que se ingresó algún texto y no es un número
function validarNombre (nombre) {

    if (nombre.value == "" || !isNaN(nombre.value)) {
        nombre.style.borderColor = "red";
        errorNombre.innerText = ("Debe ingresar un nombre");
    } else {
        borrarErrorNombre(nombre);
        return nombre.value;
    }

}

// Función que borra el borde y texto de error en notas
function borrarErrorNota(nota) {

    if (nota.id === nota1.id) {
        errorNota1.innerText = "";
    }
    if (nota.id === nota2.id) {
        errorNota2.innerText = "";
    }
    if (nota.id === nota3.id) {
        errorNota3.innerText = "";
    }

    nota.style.borderColor = "#cacaca";

}

// Función que borra el borde y texto de error en nombre
function borrarErrorNombre (nombre) {

    errorNombre.innerText = "";
    nombre.style.borderColor = "#cacaca";

}

// Función que limpia la sección de resultados
function limpiarResultados() { 

    tablaResultados.innerHTML = '';
    mostrarMejoresAlumnos.innerHTML = '';
    mostrarMejoresAlumnos.classList.remove("mostrar");

}

// Función que limpia los inputs
function limpiarInputs() {

    const inputs = document.getElementsByTagName("input");

    for (const input of inputs) {
        input.value = "";
    }

}

// Función que obtiene a los mejores alumnos de cada materia
function ObtenerMejoresAlumnos(filtro) {

    // Ordena a los alumnos que tienen mayor promedio al principio del array
    filtro.sort((a,b) => {
        if (a.promedio > b.promedio) {
            return -1;
        } else if (a.promedio < b.promedio) {
            return 1;
        } else { 
            return 0;
        }
    });

    // Obtiene los mejores promedios
    const promedioMaximo = filtro[0].promedio;
    const mejoresPromedios = filtro.filter((al) => al.promedio === promedioMaximo);

    // Guarda en un array solo los nombres de los mejores alumnos
    const mejoresAlumnos = [];

    for (const al of mejoresPromedios) {
        mejoresAlumnos.push(al.nombre);
    }

    // Muestra a los mejores alumnos
    mejoresAlumnos.length === 1 ?
    mostrarMejoresAlumnos.innerHTML = `<p>El mejor alumno de esta materia es: <span>${mejoresAlumnos[0]}</span></p>` :
    mostrarMejoresAlumnos.innerHTML = `<p>Los mejores alumnos de esta materia son: <span>${mejoresAlumnos.join(" - ")}</span></p>`;

    btnMejorAlumno.addEventListener("click",() => {
        mostrarMejoresAlumnos.classList.add("mostrar");
    });

}

// Función que muestra los resultados según la materia y guarda la info en storage
function mostrarResultados(classMateria) {

    let filtro = listadoAlumnos.filter((el) => el.materia.includes(classMateria));
    let noIncluido = listadoAlumnos.filter((el) => !el.materia.includes(classMateria));

    if (filtro.length !== 0) {

        let inJSON = JSON.stringify(filtro);
        localStorage.setItem(classMateria,inJSON);
        let outJSON = JSON.parse(localStorage.getItem(classMateria));

        for (let alumnos of outJSON) {
            let tr = document.createElement("tr");
            tr.innerHTML =  `<td>${alumnos.nombre}</td><td>${alumnos.nota1}</td><td>${alumnos.nota2}</td><td>${alumnos.nota3}</td><td>${alumnos.promedio}</td>`;
            tablaResultados.append(tr);
        }

        ObtenerMejoresAlumnos(filtro);

        // Botón que borra la info guardada en storage, los resultados y muestra alertas con SweetAlert
        btnBorrarTodo.addEventListener("click",() => {

            Swal.fire({
                title: 'Eliminar datos',
                text: '¿Estás seguro que querés eliminar todos los datos ingresados en esta materia?',
                icon: 'warning',
                showDenyButton: 'true',
                confirmButtonText: 'Si, borrar',
                confirmButtonColor: "#a92626",
                denyButtonText: 'No, cancelar',
                denyButtonColor: "#836cb1"
            }).then((result) => {

                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Datos eliminados',
                        text: 'La información ingresada fue eliminada',
                        confirmButtonColor: "#836cb1",
                        icon: 'success'
                    });

                    limpiarResultados();
                    localStorage.removeItem(classMateria);
                    listadoAlumnos = noIncluido;
                    btnBorrarTodo.classList.add("ocultar");
                    btnMejorAlumno.classList.add("ocultar");
                }

                if (result.isDenied) {
                    Swal.fire({
                        title: 'Eliminación cancelada',
                        text: 'No se han eliminado los datos',
                        confirmButtonColor: "#836cb1",
                        icon: 'error'
                    });
                }
            });
        
        });

    } 

    // Muestra el botón de mejores alumnos si tiene al menos 2 alumnos
    filtro.length < 2 ? btnMejorAlumno.classList.add("ocultar") : btnMejorAlumno.classList.remove("ocultar");
    // Muestra el botón de borrar si tiene al menos 1 alumno cargado
    filtro.length < 1 ? btnBorrarTodo.classList.add("ocultar") : btnBorrarTodo.classList.remove("ocultar");
}

// Función que guarda y muestra la información guardada en Storage en caso de recargar la página
function mostrarInfoGuardada() {

    for (let i = 0; i < localStorage.length; i++) {

        let clave = localStorage.key(i);
        backupJSON = JSON.parse(localStorage.getItem(clave));

        for (let objeto of backupJSON) {
            listadoAlumnos.push(objeto);
        }

    }

    mostrarResultados(classMateria);

}

// Obtiene que materia se quiere visualizar, oculta y muestra secciones
for (let materia of btnsMaterias) {
    materia.addEventListener("click",(e) => {

        limpiarResultados();
        classMateria = e.target.id;
        mainContainer.classList.add(classMateria)
        cntMaterias.classList.add("ocultar");
        cntForm.classList.add("mostrar");
        cntResultados.classList.add("mostrar");
        cntVolver.classList.add("mostrar");

        (listadoAlumnos.length !== 0) ? mostrarResultados(classMateria) : mostrarInfoGuardada();

    });
} 

// Vuelve a la selección de materias, oculta y muestra secciones
cntVolver.addEventListener("click",() => {

    mainContainer.classList.remove(classMateria);
    cntMaterias.classList.remove("ocultar");
    cntForm.classList.remove("mostrar");
    cntResultados.classList.remove("mostrar");
    cntVolver.classList.remove("mostrar");
    limpiarResultados();
    limpiarInputs();
    borrarErrorNombre(nombre);

    for (const nota of notas) {
        borrarErrorNota(nota);
    }

});

// Obtiene la información ingresada en el formulario
form.addEventListener("submit",(e) => {

    e.preventDefault();
    limpiarResultados();

    let nombreVal = validarNombre(nombre);
    let nota1Val = validarNota(nota1);
    let nota2Val= validarNota(nota2);
    let nota3Val = validarNota(nota3);
    let materia = mainContainer.classList[0];

    if (nota1Val && nota2Val && nota3Val && nombreVal) {
        listadoAlumnos.push(new Alumnos(nombreVal,nota1Val,nota2Val,nota3Val,materia));
        limpiarInputs();
    }

    mostrarResultados(classMateria);

});

// Obtiene archivo JSON local predeterminado y muestra alertas con SweetAlert
cargaJSON.addEventListener("click",() => {

    Swal.fire({
        title: 'Cargar datos',
        text: '¿Estás seguro que querés cargar los datos predeterminados? Se reemplazarán todos los datos ingresados',
        icon: 'warning',
        showDenyButton: 'true',
        confirmButtonText: 'Si, cargar',
        confirmButtonColor: "#a92626",
        denyButtonText: 'No, cancelar',
        denyButtonColor: "#836cb1"
    }).then((result) => {

        if (result.isConfirmed) {
            Swal.fire({
                title: 'Datos cargados',
                text: 'Se han cargado los datos predeterminados',
                confirmButtonColor: "#836cb1",
                icon: 'success'
            });

            fetch('/alumnos.json')
                .then((response) => {
                    return response.json();
                })
                .then((json) => {
                    listadoAlumnos = json;
                })
    
            mostrarResultados();
        }

        if (result.isDenied) {
            Swal.fire({
                title: 'Carga de datos cancelada',
                text: 'No se han cargado los datos predeterminados',
                confirmButtonColor: "#836cb1",
                icon: 'error'
            });
        }

    });
});