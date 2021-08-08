import { any, uniq } from "ramda";

abstract class Vendedor {
  constructor(public certificaciones: Certificacion[]) {}

  abstract puedeTrabajarEn(ciudad: Ciudad): boolean;
  abstract esInfluyente(): boolean;

  esVersatil(): boolean {
    const alMenosUnaSobreProductos = any(
      (cert) => cert.esSobreProductos,
      this.certificaciones
    );
    const alMenosUnaNoSobreProductos = any(
      (cert) => !cert.esSobreProductos,
      this.certificaciones
    );

    if (
      this.certificaciones.length >= 3 &&
      alMenosUnaSobreProductos &&
      alMenosUnaNoSobreProductos
    ) {
      return true;
    }
    return false;
  }

  esFirme(): boolean {
    if (this.puntaje() >= 30) return true;
    return false;
  }

  puntaje(): number {
    let puntajeTotal = 0;
    this.certificaciones.forEach(
      (cert) => (puntajeTotal = puntajeTotal + cert.puntaje)
    );
    return puntajeTotal;
  }
}

export class VendedorFijo extends Vendedor {
  constructor(
    public ciudadOrigen: Ciudad,
    public certificaciones: Certificacion[]
  ) {
    super(certificaciones);
  }

  puedeTrabajarEn(ciudad: Ciudad): boolean {
    return ciudad == this.ciudadOrigen;
  }
  esInfluyente(): boolean {
    return false;
  }
}

export class Viajante extends Vendedor {
  constructor(
    public provinciasDondeTrabaja: Provincia[],
    public certificaciones: Certificacion[]
  ) {
    super(certificaciones);
  }

  puedeTrabajarEn(ciudad: Ciudad): boolean {
    return any((p) => p == ciudad.provincia, this.provinciasDondeTrabaja);
  }
  esInfluyente(): boolean {
    let poblacionTotal = 0;
    this.provinciasDondeTrabaja.forEach(
      (prov) => (poblacionTotal = prov.poblacion + poblacionTotal)
    );
    if (poblacionTotal >= 10000000) return true;
    return false;
  }
}

export class ComercioCorresponsal extends Vendedor {
  constructor(
    public tieneSucursalEn: Ciudad[],
    public certificaciones: Certificacion[]
  ) {
    super(certificaciones);
  }

  puedeTrabajarEn(ciudad: Ciudad): boolean {
    return any(
      (ciudadConSucursal) => ciudad == ciudadConSucursal,
      this.tieneSucursalEn
    );
  }
  esInfluyente(): boolean {
    if (this.tieneSucursalEn.length >= 5) return true;
    const provincias: Provincia[] = [];
    this.tieneSucursalEn.forEach((ciudad) => {
      if (!provincias.includes(ciudad.provincia)) {
        provincias.push(ciudad.provincia);
      }
    });
    if (provincias.length >= 3) return true;
    return false;
  }
}

export class Provincia {
  constructor(public poblacion: number) {}
}

export class Ciudad {
  constructor(public provincia: Provincia) {}
}

export class Certificacion {
  constructor(public esSobreProductos: boolean, public puntaje: number) {}
}

export class CentroDeDistribucion {
  ciudad: Ciudad;
  vendedores: Vendedor[];

  constructor(public init_ciudad: Ciudad, public init_vendedores: Vendedor[]) {
    this.ciudad = init_ciudad;
    this.vendedores = uniq(init_vendedores);
  }

  agregarVendedor(vendedor: Vendedor): void {
    if (!this.vendedores.includes(vendedor)) {
      this.vendedores.push(vendedor);
    } else {
      throw Error("El vendedor ya existe en el Centro de Distribución");
    }
  }

  vendedorEstrella(): Vendedor {
    let estrella = this.vendedores[0];
    this.vendedores.forEach((vendedor) => {
      if (vendedor.puntaje() > estrella.puntaje()) estrella = vendedor;
    });
    return estrella;
  }

  puedeCubrir(ciudad: Ciudad): boolean {
    return any((vendedor) => vendedor.puedeTrabajarEn(ciudad), this.vendedores);
  }

  vendedoresGenericos(): Vendedor[] {
    return this.vendedores.filter((vendedor) =>
      any((cert) => !cert.esSobreProductos, vendedor.certificaciones)
    );
  }

  esRobusto(): boolean {
    const robustez = this.vendedores.filter((vendedor) => vendedor.esFirme());
    if (robustez.length >= 3) return true;
    return false;
  }
}
