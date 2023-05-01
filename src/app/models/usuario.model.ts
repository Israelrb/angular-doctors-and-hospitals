
export class Usuario {
    constructor(
        public nombre: string,
        public apellidos: string,
        public emaiL: string,
        public password?: string,
        public img?: string,
        public google?: boolean,
        public role?: string,
        public uid?: string
    ){}
}