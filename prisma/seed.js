"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🌱 Iniciando seed de Skin Care...');
        // 1. Limpiar base de datos
        yield prisma.orderProduct.deleteMany();
        yield prisma.order.deleteMany();
        yield prisma.product.deleteMany();
        yield prisma.category.deleteMany();
        console.log('🧹 Base de datos limpiada');
        // 2. Crear Categorías de Skin Care
        const cats = [
            { name: 'Limpiadores' },
            { name: 'Serums' },
            { name: 'Hidratantes' },
            { name: 'Contornos de Ojos' },
            { name: 'Fotoprotectores' },
        ];
        const createdCats = {};
        for (const cat of cats) {
            const created = yield prisma.category.create({ data: cat });
            createdCats[cat.name] = created.id;
        }
        console.log('📂 Categorías creadas');
        // 3. Crear Productos de Skin Care
        const products = [
            {
                title: 'TÓNICO LIMPIADOR FACIAL DE CÉLULAS MADRES 180 ML',
                description: 'Tónico facial hidratante a base de células madres de origen vegetal que ayuda a limpiar y purificar la piel removiendo impurezas del rostro mientras mantiene el equilibrio natural de hidratación.',
                additionalInfo: `Su fórmula ayuda a promover la regeneración celular, proteger la piel frente a agresiones externas y brindar una apariencia más firme, luminosa y rejuvenecida.

Ideal para todo tipo de piel y uso diario.

Beneficios

• Limpia y purifica profundamente la piel
• Ayuda a remover impurezas del rostro
• Efecto anti edad
• Favorece la regeneración celular
• Ayuda a mantener la hidratación de la piel
• Protege frente a agresiones externas
• Deja la piel más firme y luminosa
• Ideal para uso diario

Ingredientes Principales

• Células Madres de Origen Vegetal

Modo de Uso

Humedecer una toallita facial o algodón con el producto y aplicar sobre rostro, cuello y escote. Masajear suavemente hasta lograr su completa absorción. Se recomienda usar por la mañana y noche.

Advertencias

• Solo para uso externo
• Evitar el contacto con los ojos
• Mantener en un lugar fresco
• Realizar una prueba cutánea antes de usar
• Suspender su uso si presenta alguna reacción desfavorable

Información del Producto

• Producto: Tónico Limpiador Facial de Células Madres
• Contenido: 180 ml
• Marca: Nevada Natural Products
• Tipo de piel: Todo tipo de piel
• Beneficio principal: Limpieza, hidratación y efecto anti edad
• Origen: Panamá`,
                price: 65.0,
                discountPrice: 55.0,
                categoryId: createdCats['Limpiadores'],
                images: JSON.stringify(['/images/limpiador.png']),
                isActive: true,
                isFeatured: true,
                stock: 50,
            },
            {
                title: 'Espuma Limpiadora Suave Piel Sensible',
                description: 'Espuma calmante con extracto de manzanilla y aloe vera. Limpia profundamente respetando la barrera cutánea.',
                price: 55.0,
                categoryId: createdCats['Limpiadores'],
                images: JSON.stringify(['/images/limpiador.png']),
                isActive: true,
                isFeatured: false,
                stock: 30,
            },
            {
                title: 'Serum Vitamina C 15% Iluminador',
                description: 'Potente antioxidante que unifica el tono de la piel, aporta luminosidad y combate los radicales libres. Úsalo de día antes de tu protector solar.',
                price: 120.0,
                discountPrice: 99.0,
                categoryId: createdCats['Serums'],
                images: JSON.stringify(['/images/serum.png']),
                isActive: true,
                isFeatured: true,
                stock: 40,
            },
            {
                title: 'Serum Ácido Hialurónico Puro 2%',
                description: 'Hidratación profunda en múltiples capas de la piel. Rellena líneas de expresión finas y deja un acabado jugoso (glass skin).',
                price: 85.0,
                categoryId: createdCats['Serums'],
                images: JSON.stringify(['/images/serum.png']),
                isActive: true,
                isFeatured: true,
                stock: 100,
            },
            {
                title: 'Crema Hidratante Reparadora Ceramidas',
                description: 'Crema de textura rica y rápida absorción. Restaura la barrera protectora de la piel gracias a sus 3 ceramidas esenciales.',
                price: 75.0,
                categoryId: createdCats['Hidratantes'],
                images: JSON.stringify(['/images/hidratante.png']),
                isActive: true,
                isFeatured: false,
                stock: 60,
            },
            {
                title: 'Gel Hidratante Oil-Free Matificante',
                description: 'Hidratación ligera en formato gel para pieles grasas o con tendencia acneica. Controla el brillo durante el día.',
                price: 68.0,
                categoryId: createdCats['Hidratantes'],
                images: JSON.stringify(['/images/hidratante.png']),
                isActive: true,
                isFeatured: false,
                stock: 45,
            },
            {
                title: 'Fotoprotector Fluido Invisible SPF 50+',
                description: 'Protector solar de amplio espectro UVA/UVB. Textura ultraligera que no deja residuo blanco. Ideal para reaplicar sobre maquillaje.',
                price: 95.0,
                discountPrice: 85.0,
                categoryId: createdCats['Fotoprotectores'],
                images: JSON.stringify(['/images/fotoprotector.png']),
                isActive: true,
                isFeatured: true,
                stock: 80,
            },
            {
                title: 'Protector Solar Toque Seco con Color SPF 50',
                description: 'Unifica el tono de la piel mientras protege del sol y la luz azul. Acabado mate perfecto para el día a día.',
                price: 105.0,
                categoryId: createdCats['Fotoprotectores'],
                images: JSON.stringify(['/images/fotoprotector.png']),
                isActive: true,
                isFeatured: false,
                stock: 35,
            },
            {
                title: 'Crema Contorno de Ojos Descongestionante',
                description: 'Tratamiento específico para ojeras y bolsas. Con cafeína y péptidos para una mirada más descansada e iluminada.',
                price: 89.0,
                categoryId: createdCats['Contornos de Ojos'],
                images: JSON.stringify(['/images/contorno.png']),
                isActive: true,
                isFeatured: false,
                stock: 25,
            },
        ];
        for (const prod of products) {
            yield prisma.product.create({ data: prod });
        }
        console.log('🧴 Productos de Skin Care creados con éxito');
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
