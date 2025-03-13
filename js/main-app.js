let app = new Vue({
    el: '#app',
    data: {
        columns: {
            firstColumn: [],
            secondColumn: [],
            thirdColumn: [],
        },

        newCard: {
            title: '',
            items: []
        },

        blockFirstColumn: false
    },

    methods: {
        addCard() {
            if (this.columns.firstColumn.length < 3) {
                this.columns.firstColumn.push({
                    title: this.newCard.title,
                    items: this.newCard.items.split(',').map(item => ({
                        title: item.trim(),
                        completed: false
                    })),
                    completed: null
                })
                this.newCard = {title: '', items: []}
            } else {
                alert('Первый столбец может содержать не более 3 карточек')
            }
        },

        updateProgress(column, index) {
            const card = this.columns[column][index]
            const completedItems = card.items.filter(item => item.completed).length
            const progress = (completedItems / card.items.length) * 100

            if  (column === 'firstColumn' && progress > 50) {
                if (this.columns.secondColumn.length >= 5) {
                    this.blockFirstColumn = true
                }
            }

            if (progress === 100 && column !== 'thirdColumn') {
                card.completedAt = new Date().toLocaleString()
                this.moveCard(column, index, 'thirdColumn')
            } else if (progress > 50 && column === 'firstColumn') {
                this.moveCard(column, index, 'secondColumn')
            }
        },

        moveCard(fromColumn, cardIndex, toColumn) {
            if (toColumn === 'secondColumn' && this.columns[toColumn].length >= 5) {
                alert('Второй столбец может содержать не более 5 карточек')
                return
            }
            const card = this.columns[fromColumn].splice(cardIndex, 1)[0]
            this.columns[toColumn].push(card)
        }
    }
})