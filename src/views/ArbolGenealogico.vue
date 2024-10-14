<template>
    <h1>Árbol Genealógico</h1>
    <p>Use la rueda del ratón para hacer zoom, si desea ver más info del animal presione en la foto y se desplegará más info.</p>
    <div ref="treeContainer" class="tree-container">
        <div ref="tree" style="border-width: 5px;border-color: black;border-width: thin;border-style: dashed;"></div>
        <!-- <div v-if="showTooltip" :style="tooltipStyle" class="tooltip">
            <p><strong>{{ selectedNode.name }}</strong></p>
            <p>Información adicional: {{ selectedNode.galloInfo.observacion }}</p>
            <v-img :width="291" aspect-ratio="1/1" cover :src="selectedNode.image"></v-img>
            <v-btn @click="()=>{verPadresGallo(selectedNode); console.log(selectedNode)}">Ver padres</v-btn>
            <v-btn @click="()=>{showTooltip = false}">Cerrar</v-btn>
        </div> -->
        <v-dialog v-model="showTooltip" width="auto">
            <v-card v-if="showTooltip" :title="selectedNode.name" :text="selectedNode.galloInfo.observacion">
                <v-img :width="291" aspect-ratio="1/1" cover :src="selectedNode.image"></v-img>
                <v-card-actions>
                    <v-btn @click="()=>{verPadresGallo(selectedNode); console.log(selectedNode)}">Ver padres</v-btn>
                    <v-btn @click="()=>{showTooltip = false}">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { STATUS_OK, URL_SIN_FOTO } from '@/api/constans';
import { buscarGalloAPI, buscarGallosPadreAPI } from '@/api/gallosApi';
import * as d3 from 'd3';

export default {
    name: 'GenealogyTree',
    data() {
        return {
            treeData: {
            },
            showTooltip: false,
            tooltipStyle: {
                position: 'absolute',
                display: 'none',
            },
            selectedNode: {},
            posActual : 0,
            width : 0
        }
    },
    computed: {
        galloId() {
            return this.$route.params.id_gallo || null;
        },
    },
    async mounted() {
        await this.infoGallo(); // Esperar a que se carguen los datos
        window.addEventListener('resize', this.onResize);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.onResize);
    },
    methods: {
        async infoGallo() {
            const pet = await buscarGalloAPI(this.galloId);
            //primer elemento sera el hijo
            if(pet.status == STATUS_OK){
                this.treeData = {
                    galloInfo : {...pet.data},
                    id : Math.floor(Math.random() * 1000),
                    pos : 0,
                    name : `${pet.data.nro_placa} - ${pet.data.nombre}`,
                    image : pet.data.ruta_foto,
                    children : []
                };
                const resp = await buscarGallosPadreAPI(this.galloId);
                if(resp.status == STATUS_OK){
                    this.agregarPadres(this.treeData.id,resp.data);
                }
                this.createGenealogyTree();
            }
        },
        agregarPadres(id,padres){
            this.removeParentsOfNode(id);
            if(padres.padre != null){
                this.addChildToNode(id,padres.padre);
            }
            if(padres.madre != null){
                this.addChildToNode(id,padres.madre);
            }
        },
        // Función para agregar un hijo a un nodo específico
        removeParentsOfNode(parentId){
            // Encontrar el nodo al que le vamos a agregar el hijo
            const addToNode = (node) => {
                if (node.id === parentId) {
                    node.children = [];
                    return true; // Una vez que encontramos el nodo, terminamos la búsqueda
                }
                if (node.children) {
                    for (let child of node.children) {
                        if (addToNode(child)) {
                            return true;
                        }
                    }
                }
                return false;
            };

            addToNode(this.treeData); // Llamamos a la función recursiva
        },
        addChildToNode(parentId,info) {
            const newId = Math.floor(Math.random() * 1000); // ID único aleatorio
            const newNode = { galloInfo : {...info}, id : newId, name : `${info.nro_placa} - ${info.nombre}`, image : info.ruta_foto, children : [] };

            // Encontrar el nodo al que le vamos a agregar el hijo
            const addToNode = (node) => {
                if (node.id === parentId) {
                    node.children.push(newNode);
                    return true; // Una vez que encontramos el nodo, terminamos la búsqueda
                }
                if (node.children) {
                    for (let child of node.children) {
                        if (addToNode(child)) {
                            return true;
                        }
                    }
                }
                return false;
            };

            addToNode(this.treeData); // Llamamos a la función recursiva
        },
        // calculateWidth() {
        //     this.width = this.$refs.treeContainer.clientWidth;
        // },
        onResize() {
            d3.select(this.$refs.tree).selectAll('*').remove();
            this.createGenealogyTree();
        },
        async verPadresGallo(gallo){
            const resp = await buscarGallosPadreAPI(gallo.galloInfo.id_gallo);
            
            if(resp.status == STATUS_OK){
                this.agregarPadres(gallo.id,resp.data);
            }
            d3.select(this.$refs.tree).selectAll('*').remove(); // Limpiamos el árbol anterior
            this.createGenealogyTree();
        },
        createGenealogyTree() {
            const data = this.treeData;

            const margin = { top: 20, right: 90, bottom: 30, left: 90 };
            const width = 1250 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;

            // Crear el SVG y hacerlo responsivo
            const svg = d3.select(this.$refs.tree)
                .append('svg')
                .attr('width', '100%')
                .attr('height', height + margin.top + margin.bottom)
                .attr('viewBox', `0 0 ${1250} ${height + margin.top + margin.bottom}`);

            // Grupo contenedor para aplicar el zoom
            const svgGroup = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // Aplicar zoom y desplazamiento al SVG
            const zoom = d3.zoom()
                .scaleExtent([0.5, 2]) // Limitar el zoom de 0.5x a 2x
                .on('zoom', (event) => {
                    svgGroup.attr('transform', event.transform); // Aplicar la transformación de zoom
                });

            svg.call(zoom); // Llamamos a la función de zoom sobre el SVG

            const root = d3.hierarchy(data);
            const treeLayout = d3.tree().size([height, width]);
            treeLayout(root);

            // Crear las líneas rectas entre los nodos
            svgGroup.selectAll(".link")
                .data(root.links())
                .enter()
                .append("line")
                .attr("class", "link")
                .attr("x1", d => d.source.y)
                .attr("y1", d => d.source.x)
                .attr("x2", d => d.target.y)
                .attr("y2", d => d.target.x)
                .attr("stroke", "#555")
                .attr("stroke-width", 1.5);

            // Crear los nodos
            const node = svgGroup.selectAll(".node")
                .data(root.descendants())
                .enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", d => `translate(${d.y},${d.x})`)  // Añadir más espacio vertical y horizontal
                .on('click', (event, d) => this.showNodeTooltip(event, d)); // Llamar a la función del tooltip
            // Añadir imágenes a los nodos
            node.append("image")
                .attr("xlink:href", d => d.data.image)
                .attr("x", -20)  // Mueve la imagen un poco más a la izquierda
                .attr("y", -20)  // Mueve la imagen un poco más arriba
                .attr("width", 40)  // Ajusta el tamaño de la imagen
                .attr("height", 40);

            // Añadir texto a los nodos
            node.append("text")
                .attr("dy", ".35em")
                .attr("x", d => d.children ? -20 : 20)
                .style("text-anchor", d => d.children ? "end" : "start")
                .text(d => d.data.name);
        },
        showNodeTooltip(event, d) {
            this.selectedNode = d.data;
            this.tooltipStyle = {
                display: 'block',
                left: `${event.pageX + 10}px`,
                top: `${event.pageY + 10}px`,
                position: 'absolute',
                background: '#fff',
                border: '1px solid #ccc',
                padding: '10px',
                'box-shadow': '0px 4px 8px rgba(0, 0, 0, 0.2)',
                'border-radius': '8px',
            };
            this.showTooltip = true;
        }
    },
};
</script>

<style scoped>
.tree-container {
    width: 100%;
    height: 500px;
}

.link {
    fill: none;
    stroke: #555;
    stroke-opacity: 0.6;
    stroke-width: 1.5px;
}

.node text {
    font: 12px sans-serif;
}

.tooltip {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    padding: 8px;
    font-size: 14px;
    z-index: 10;
    border-radius: 4px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    /* pointer-events: none; */
}
</style>