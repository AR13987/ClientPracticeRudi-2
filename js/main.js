let eventBus = new Vue()


Vue.component('socks-detail', {
    props: {
        details: {
            type: Array, required: true
        }
    },

    template: `
    <div class="socks-detail">
        <ul>
            <li v-for="detail in details">{{detail}}</li>
        </ul>
    </div>`
})


Vue.component('socks-tabs', {
    props: {
        reviews: {
            type: Array, required: false
        },
        details: {
            type: Array, required: true
        },
        shipping: {
            type: Function, required: true
        }
    },

    template: `
     <div>   
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Reviews'">
         <p v-if="!reviews.length">There are no reviews yet.</p>
         <ul>
           <li v-for="review in reviews">
           <p>{{ review.name }}</p>
           <p>Rating: {{ review.rating }}</p>
           <p>{{ review.review }}</p>
           <p>Recommend: {{review.recommend}}</p>
           </li>
         </ul>
       </div>
       <div v-show="selectedTab === 'Make a Review'">
         <socks-review></socks-review>
       </div>
       <div v-show="selectedTab === 'Details'">
         <socks-detail :details="details"></socks-detail>
       </div>
       <div v-show="selectedTab === 'Shipping'">
         <p>Shipping: {{shipping()}}</p>
       </div>
     </div>
`, data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'], selectedTab: 'Reviews'
        }
    }
})


Vue.component('socks-review', {
    template: `
    <div>
    <form class="review-form" @submit.prevent="onSubmit">
        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>

        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
        </p>

        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>

        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>

        <p>
            <label>Would you recommend this product?</label>
            <input type="radio" id="yes" value="Yes" v-model="recommend">
            <label for="yes">Yes</label>
            <input type="radio" id="no" value="No" v-model="recommend">
            <label for="no">No</label>
        </p>

        <p>
            <input type="submit" value="Submit"> 
        </p>
    </form>
   </div>`,

    data() {
        return {
            name: null, review: null, rating: null, errors: [], recommend: null
        }
    },

    methods: {
        onSubmit() {
            this.errors = [];

            if (!this.name) {
                this.errors.push("Name is required.");
            }
            if (!this.review) {
                this.errors.push("Review is required.");
            }
            if (!this.rating) {
                this.errors.push("Rating is required.");
            }
            if (!this.recommend) {
                this.errors.push("Please select whether you recommend this product.");
            }

            if (this.errors.length) {
                return;
            }


            let socksReview = {
                name: this.name, review: this.review, rating: this.rating, recommend: this.recommend
            };

            eventBus.$emit('review-submitted', socksReview)
            this.name = null;
            this.review = null;
            this.rating = null;
            this.recommend = null;
        }
    }
})


Vue.component('socks', {
    props: {
        premium: {
            type: Boolean, required: true,
        }
    },

    template: `
    <div class="socks">
        <div class="socks-image">
            <!-- : или v-bind-->
            <img :alt="altText" :src="image">
        </div>

        <div class="socks-info">
            <h1>{{title}}</h1>
            <a :href="link">{{linkText}}</a>

            <!--         <p v-if="inventory > 10">In Stock</p>-->
            <!--         <p v-else-if="inventory <=10 && inventory > 0">Almost sold out!</p>-->
            <!--         <p v-else>Out of Stock</p>-->
            <p :class="{OutOfStock: !inStock}" v-show="!inStock">Out of Stock</p>
            <p v-show="inStock">In Stock</p>
            <span v-show="sale">On Sale</span>
            
            <div class="socks-detail">
<!--                <socks-detail :details="details"></socks-detail>-->
                <div class="color-box" v-for="(variant, index) in variants" :key=variant.variantId
                     :style="{backgroundColor: variant.variantColor}"
                     @mouseover="updateSocks(index)">
                </div>
                <ul>
                    <li v-for="size in sizes">{{size}}</li>
                </ul>
                <button v-on:click="addToCart" :disabled="!inStock"
                        :class="{disabledButton: !inStock}">Add to cart
                </button>
                <button v-on:click="reduceToCart" :disabled="!inStock" 
                :class="{disabledButton: !inStock}">Reduce to cart</button>
            </div>
        </div>
    </div>`,

    data() {
        return {
            product: "Socks", // image: "./assets/vmSocks-blue-onWhite.jpg",
            altText: "A pair of warm, fuzzy socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            linkText: "More products like this", // inventory: 10,
            brand: "Vue Mastery", // inStock: true,
            details: ['80 cotton', '20% polyester', 'Gender-neutral'],
            variants: [{
                variantId: 1,
                variantColor: "green",
                variantImage: "./assets/vmSocks-green-onWhite.jpg",
                variantQuantity: 10,
                onSale: 1
            }, {
                variantId: 2,
                variantColor: "blue",
                variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                variantQuantity: 0,
                onSale: 0
            }],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            selectedVariant: 0
        }
    },

    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },

        reduceToCart() {
            this.$emit('reduce-to-cart', this.variants[this.selectedVariant].variantId);
        }, updateSocks(index) {
            this.selectedVariant = index
            console.log(index)
        }
    },

    computed: {
        title() {
            return this.brand + ' ' + this.product
        }, image() {
            return this.variants[this.selectedVariant].variantImage
        }, inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        }, sale() {
            return this.variants[this.selectedVariant].onSale
        }

    }

})


let app = new Vue({
    el: '#app', data: {
        premium: true, cart: [], reviews: [], details: ['80 cotton', '20% polyester', 'Gender-neutral']
    },

    methods: {
        updateAddCart(id) {
            this.cart.push(id)
        }, updateReduceCart(id) {
            this.cart.splice(id, 1)
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        },
    },
    mounted() {
        eventBus.$on('review-submitted', socksReview => {
            this.reviews.push(socksReview)
        })
    }
})