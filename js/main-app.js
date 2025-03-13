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
            if (this.blockFirstColumn) {
                alert('Первый столбец заблокирован, пока одна из карточек второго столбца не будет завершена')
                return
            }

            if (this.columns.firstColumn.length < 3) {
                if (this.newCard.items.length < 3 || this.newCard.items.length > 5) {
                    alert('Карточка должна содержать от 3 до 5 задач')
                    return
                }
                this.columns.firstColumn.push({
                    title: this.newCard.title,
                    items: this.newCard.items.map(item => ({
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

            if (progress === 100 && column === 'secondColumn') {
                card.completedAt = new Date().toLocaleString()
                this.moveCard(column, index, 'thirdColumn')

                if (this.columns.secondColumn.length < 5) {
                    this.blockFirstColumn = false
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