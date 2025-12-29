export type Cliente = {
  id: number;
  nombre: string;
  paterno: string;
  materno: string;
  tipo_documento: string;
  documento_identidad: string;
  fecha_nacimiento: string;
  genero: "M" | "F" | "Otro";
  fecha_creacion: string;
};
