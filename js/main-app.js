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
            items: ''
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
                const itemsArray = this.newCard.items.split(',').map(item => ({
                   text: item.trim(),
                   completed: false
                }))

                if (itemsArray.length < 3 || itemsArray.length > 5) {
                    alert('Карточка должна содержать от 3 до 5 задач')
                    return
                }

                this.columns.firstColumn.push({
                    title: this.newCard.title,
                    items: itemsArray,
                    completedAt: null
                })

                this.newCard = {title: '', items: ''}
                this.saveData()
            } else {
                alert('Первый столбец может содержать не более 3 карточек')
            }
        },

        updateProgress(column, index) {
            const card = this.columns[column][index]
            const completedItems = card.items.filter(item => item.completed).length
            const progress = (completedItems / card.items.length) * 100

            if (progress === 100) {
                card.completedAt = new Date().toLocaleString()
                this.moveCard(column, index, 'thirdColumn')

                if (column === 'secondColumn' && this.columns.secondColumn.length < 5) {
                    this.blockFirstColumn = false
                }

            } else if (progress > 50 && column === 'firstColumn') {
                this.moveCard(column, index, 'secondColumn')

                if (this.columns.secondColumn.length >= 5) {
                    this.blockFirstColumn = true
                }
            }

            this.saveData()
        },

        moveCard(fromColumn, cardIndex, toColumn) {
            if (toColumn === 'secondColumn' && this.columns[toColumn].length >= 5) {
                alert('Второй столбец может содержать не более 5 карточек')
                return
            }
            const card = this.columns[fromColumn].splice(cardIndex, 1)[0]
            this.columns[toColumn].push(card)
            this.saveData()
        },

        saveData() {
            const data = {
                columns: this.columns,
                blockFirstColumn: this.blockFirstColumn,
            }
            localStorage.setItem('notesAppData', JSON.stringify(data))
        },

        loadData() {
            const savedData = localStorage.getItem('notesAppData')
            if (savedData) {
                const parsedData = JSON.parse(savedData)
                this.columns = parsedData.columns
                this.blockFirstColumn = parsedData.blockFirstColumn
            }
        }
    },

    created() {
        this.loadData()
    }
})