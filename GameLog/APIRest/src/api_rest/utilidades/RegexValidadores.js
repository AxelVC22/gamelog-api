export const SoloLetras = /^[a-zA-ZñÑáéíóúÁÉÍÓÚçÇ' -]+$/;
export const SoloLetrasNumerosCaracteres = /^[\wñÑáéíóúÁÉÍÓÚüÜ\s\n\r!¡&*()_+=\[\]{};:'"’,.¿?`^\\\/@#%-]*$/u;
export const SoloDecimalesPositivos = /^\d{1,2}\.\d{1}$/;
export const SoloLetrasYNumeros = /^[a-zA-Z0-9]+$/;
export const SoloRutas = /^(\/?[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/;
