import {
  Ciudad,
  Provincia,
  VendedorFijo,
  Viajante,
  ComercioCorresponsal,
  Certificacion,
  CentroDeDistribucion,
} from "./vendedores";

const buenosAires = new Provincia(16660000);
const tucuman = new Provincia(1593000);
const santaFe = new Provincia(3369000);
const sierra = new Ciudad(buenosAires);
const tafiDelValle = new Ciudad(tucuman);
const rosario = new Ciudad(santaFe);
const laPlata = new Ciudad(buenosAires);
const marDelPlata = new Ciudad(buenosAires);
const cert_no_prod_10 = new Certificacion(false, 10);
const cert_prod_15 = new Certificacion(true, 15);
const cert_prod_20 = new Certificacion(true, 20);
const cert_prod_50 = new Certificacion(true, 50);

const vendedorFijo = new VendedorFijo(sierra, [cert_no_prod_10]);
const vendedorFijo2 = new VendedorFijo(rosario, [cert_prod_20, cert_prod_50]);
const viajante = new Viajante(
  [tucuman],
  [cert_prod_15, cert_prod_20, cert_prod_50]
);
const viajante2 = new Viajante(
  [tucuman, buenosAires],
  [cert_prod_15, cert_prod_20, cert_prod_50]
);
const comercioCorresponsal = new ComercioCorresponsal(
  [sierra, tafiDelValle],
  [cert_no_prod_10, cert_prod_20, cert_prod_15]
);
const comercioCorresponsal2 = new ComercioCorresponsal(
  [sierra, tafiDelValle, marDelPlata, laPlata, rosario],
  [cert_no_prod_10, cert_prod_20, cert_prod_15]
);
const comercioCorresponsal3 = new ComercioCorresponsal(
  [sierra, tafiDelValle, rosario],
  [cert_no_prod_10]
);

const centroDeDistribucion = new CentroDeDistribucion(sierra, [
  vendedorFijo,
  viajante2,
  comercioCorresponsal,
]);
const centroDeDistribucion2 = new CentroDeDistribucion(rosario, [
  comercioCorresponsal2,
  vendedorFijo2,
  comercioCorresponsal,
]);

describe("Vendedores", () => {
  describe("1 - puede trabajar", () => {
    describe("vendedor fijo", () => {
      it("en la ciudad donde vive", () => {
        expect(vendedorFijo.puedeTrabajarEn(sierra)).toBeTruthy();
      });

      it("en otra ciudad", () => {
        expect(vendedorFijo.puedeTrabajarEn(tafiDelValle)).toBeFalsy();
      });
    });

    describe("viajante", () => {
      it("una ciudad que queda en una provincia donde trabaja", () => {
        expect(viajante.puedeTrabajarEn(tafiDelValle)).toBeTruthy();
      });

      it("una ciudad que queda en una provincia donde no trabaja", () => {
        expect(viajante.puedeTrabajarEn(sierra)).toBeFalsy();
      });
    });
    describe("Comercio Corresponsal", () => {
      it("en una ciudad donde tenga sucursal", () => {
        expect(comercioCorresponsal.puedeTrabajarEn(sierra)).toBeTruthy();
      });

      it("en una ciudad donde NO tenga sucursal", () => {
        expect(comercioCorresponsal.puedeTrabajarEn(rosario)).toBeFalsy();
      });
    });
  });

  describe("Versatilidad", () => {
    it("menos de 3 certificaciones no es versátil", () => {
      expect(vendedorFijo.esVersatil()).toBeFalsy();
    });
    it("3 o más certificaciones pero todas del mismo tipo", () => {
      expect(viajante.esVersatil()).toBeFalsy();
    });
    it("3 o más certificaciones, al menos 1 de producto, al menos 1 de NO producto", () => {
      expect(comercioCorresponsal.esVersatil()).toBeTruthy();
    });
  });

  describe("Firmeza", () => {
    it("menos de 30 puntos no es firme", () => {
      expect(vendedorFijo.esFirme()).toBeFalsy();
    });
    it("30 puntos es firme", () => {
      expect(viajante.esFirme()).toBeTruthy();
    });
    it("más de 30 puntos es firme", () => {
      expect(comercioCorresponsal.esFirme()).toBeTruthy();
    });
  });
  describe("Influencia", () => {
    describe("Vendedor Fijo", () => {
      it("si es vendedor fijo no es influyente", () => {
        expect(vendedorFijo.esInfluyente()).toBeFalsy();
      });
    });
    describe("Viajante", () => {
      it("la población de las provincias es superior a 10.000.000", () => {
        expect(viajante2.esInfluyente()).toBeTruthy;
      });
      it("la población de las provincias es inferior a 10.000.000", () => {
        expect(viajante.esInfluyente()).toBeFalsy;
      });
    });
    describe("Comercio Corresponsal", () => {
      it("está en 5 o más ciudades", () => {
        expect(comercioCorresponsal2.esInfluyente()).toBeTruthy();
      });
      it("está en menos de 5 ciudades pero en 3 o más provincias", () => {
        expect(comercioCorresponsal3.esInfluyente()).toBeTruthy();
      });
      it("está en menos de 5 ciudades y/o 3 provincias", () => {
        expect(comercioCorresponsal.esInfluyente()).toBeFalsy();
      });
    });
  });
});

describe("Centros de distribución", () => {
  it("su vendedor estrella es quién tenga mayor puntaje", () => {
    console.log(
      "Vendedor 0 puntaje: " + centroDeDistribucion.vendedores[0].puntaje()
    );
    console.log(
      "Vendedor 1 puntaje: " + centroDeDistribucion.vendedores[1].puntaje()
    );
    console.log(
      "Vendedor 2 puntaje: " + centroDeDistribucion.vendedores[2].puntaje()
    );
    expect(centroDeDistribucion.vendedorEstrella()).toEqual(
      centroDeDistribucion.vendedores[1]
    );
  });
  it("puede cubrir ciudad si por lo menos un vendedor puede trabajar allí", () => {
    expect(centroDeDistribucion.puedeCubrir(marDelPlata)).toBeTruthy();
    expect(centroDeDistribucion.puedeCubrir(rosario)).toBeFalsy();
  });
  it("devuelve correctamente vendedores genéricos", () => {
    expect(centroDeDistribucion.vendedoresGenericos()).toEqual([
      vendedorFijo,
      comercioCorresponsal,
    ]);
  });
  it("es robusto si al menos 3 de sus vendedores registrados es firme", () => {
    expect(centroDeDistribucion.esRobusto()).toBeFalsy();
    expect(centroDeDistribucion2.esRobusto()).toBeTruthy();
  });
});
