const express = require('express');
const app = express();
const port = 3000;


// app.get('/', (req, res) => {
//     res.json({abc: 123});
// });
//
// app.get('/api', (req, res) => {
//     res.json({api: 1234});
// });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

const Sequelize = require('sequelize');
const sequelize = new Sequelize('toDosDb', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
let todos = sequelize.define('todos', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: true
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },

});
app.use(express.json());

app.post('/', (req, res) => {
    todos.create({
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed
    })
        .then(todos => res.status(200).json(todos))
        .catch(err => res.status(500).json({message: 'Error saving todo', error: err}))
});

app.get('/', (req, res) => {
    todos.findAll()
        .then(todos => res.status(200).json(todos))
        .catch(err => res.status(500).json({message: 'Error fetching todos', error: err}))
});
app.get('/:id', (req, res) => {
    todos.findByPk(req.params.id)
        .then(todos => res.status(200).json(todos))
        .catch(err => res.status(500).json({message: 'Error fetching todos', error: err}))
});
app.put('/todos/:id', (req, res) => {
    todos.update({
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed
    }, {
        where: {
            id: req.params.id
        }
    })
        .then(updatedRows => {
            if (updatedRows[0] === 0) {
                return res.status(404).json({message: 'Todo not found'});
            }
            return todos.findByPk(req.params.id);
        })
        .then(updatedTodo => {
            return res.status(200).json(updatedTodo);
        })
        .catch(error => {
            return res.status(500).json({message: 'Error updating todo', error});
        });
});
app.delete('/todos/:id', (req, res) => {
    todos.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(deletedRows => {
            if (deletedRows === 0) {
                return res.status(404).json({message: 'Todo not found'});
            }
            return res.status(200).json({message: 'Todo deleted'});
        })
        .catch(error => {
            return res.status(500).json({message: 'Error deleting todo', error});
        });
});
todos.sync({alter: true}).then(() => {
    console.log('Table created!');
});




