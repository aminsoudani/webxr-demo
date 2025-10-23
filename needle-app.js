

// Needle Engine attributes we want to allow to be overriden
const knownAttributes = [
    "src",
    "background-color", 
    "background-image", 
    "environment-image", 
    "focus-rect",
];

const scriptUrl = new URL(import.meta.url);
const componentName = scriptUrl.searchParams.get("component-name") || 'needle-app';


if (!customElements.get(componentName)) {
    console.debug(`Defining needle-app as <${componentName}>`);
    customElements.define(componentName, class extends HTMLElement {

        static get observedAttributes() {
            return knownAttributes;
        }

        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            const template = document.createElement('template');
            template.innerHTML = `
                <style>
                    :host {
                        position: relative;
                        display: block;
                        width: max(360px 100%);
                        height: max(240px, 100%);
                        margin: 0;
                        padding: 0;
                    }
                    needle-engine {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                    }
                </style>
            `;
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            const script = document.createElement('script');
            script.type = 'module';
            const url = new URL('.', import.meta.url);
            this.basePath = this.getAttribute('base-path') || `${url.protocol}//${url.host}${url.pathname}`;
            while(this.basePath.endsWith('/')) {
                this.basePath = this.basePath.slice(0, -1);
            }
            script.src = this.getAttribute('script-src') || `${this.basePath}/assets/index-0cfc5465.js`;
            this.shadowRoot.appendChild(script);

            this.needleEngine = document.createElement('needle-engine');
            this.updateAttributes();
            this.shadowRoot.appendChild(this.needleEngine);

            console.debug(this.basePath, script.src, this.needleEngine.getAttribute("src"));
        }

        onConnectedCallback() {
            console.debug('NeedleEmbed connected to the DOM');
        }

        disconnectedCallback() {
            console.debug('NeedleEmbed disconnected from the DOM');
        }
        
        attributeChangedCallback(name, oldValue, newValue) {
            console.debug(`NeedleApp attribute changed: ${name} from ${oldValue} to ${newValue}`);
            this.updateAttributes();
        }

        updateAttributes() {
            console.debug("NeedleApp updating attributes");
            
            const src = this.getAttribute('src') || `${this.basePath}/assets/Sandbox.glb`;
            if(src) this.needleEngine.setAttribute("src", src);
            else this.needleEngine.removeAttribute("src");

            for(const attr of knownAttributes) {
                
                if(attr === "src") continue; // already handled above

                if(this.hasAttribute(attr)) {
                    this.needleEngine.setAttribute(attr, this.getAttribute(attr));
                }
                else {
                    this.needleEngine.removeAttribute(attr);    
                }
            }
        }
    });
}
else {
    console.warn(`needle-app <${componentName}> already defined.`);
}
