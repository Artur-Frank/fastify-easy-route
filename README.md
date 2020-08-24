# fastify-easy-route

Данный пакет предназначен для автоматической регистрации контроллеров api с использованием fastify.
Больше не нужно прописывать каждый GET, POST и тд. запросы для создания api. Установи этот пакет и наслаждайся! =)

## Установка

    npm i -s fastify-easy-route

## Использование

Этот пакет подключается как плагин и с коробки позволяет запустить api без прописывания роутов.

> **Как подключить?**

```js
fastify.register(require('fastify-easy-route'));
```

> **Какие параметры принимает плагин?**
```js
fastify.register(require('fastify-easy-route'), {
    // Название папки или путь к папке с корня приложения для хранятся контроллеры
    path:  "controller", 
    // Путь для импорта функции которая будет выполнена перед каждым запросом.
    middleware:  "./lib/middleware/Auth"
});
```

> **Как создать контроллер?**

После того как мы подключили плагин нам нужно создать контроллер.
Переходим в папку указанную в параметре **path** и теперь давайте разберемся:

Создадим файл **index.js** и будем понимать что файлы с именем **index** это "/"
```js
module.exports = {
method:  "GET",
    async  execute(fastify, request, reply) {
         try {
              // тут код вашего контроллера
              reply.send({ hello: 'world' })
         }
         catch (error) {
              console.log(err);
              reply.send({ error: 500 })
        }
    }
}
```

и когда мы запустим api и сделаем GET запрос http://localhost:3000/ в ответ получим: 
**{ hello:  'world'  }**

Так же если мы создадим папку **information** и в ней создадим файл **language.js**
```js
module.exports = {
method:  "GET",
    async  execute(fastify, request, reply) {
         try {
              // тут код вашего контроллера
             return reply.send({ language: 'RU' })
         }
         catch (error) {
              console.log(err);
             return reply.send({ error: 500 })
        }
    }
}
```
и сделаем GET запрос http://localhost:3000/information/language то получим соответственно ответ:
**{ language: 'RU' }**

> **Димамический роутинг**

Динамический роутинг так же поддерживается в данном api. Для того чтобы роут стал динамическим достаточно создать файл с именем переменной которую вы будете передавать:

`[name].js`  - [name] это имя переменной, оно может иметь любое... к примеру [id] или [post] и тд.

Получить параметр который вы передали контроллеру можно внутри функции execute таким образом:  `request.params.name`, если ваш файл называется [id].js то получение параметра будет выглядеть  `request.params.id`.

> **Как работать с middleware**

middleware получает полный доступ к контроллеру который должен вызваться после него.
По этому очень удобно указывать данные доступа к контроллеру прям в контроллере:

```js
module.exports = {
method:  "POST",
auth: true
    async  execute(fastify, request, reply) {
         try {
              // тут код вашего контроллера
             return reply.send({ language: 'RU' })
         }
         catch (error) {
              console.log(err);
             return reply.send({ error: 500 })
        }
    }
}
```

и потом обработать переменную **auth** которую мы указали в контроллере в middleware:

```js
async  function  execute(fastify, command, request, reply) {
	try {
		// Тут мы производим нужную проверку
		if( command.auth ) {
		    // Проверяем авторезирован пользователь или нет 
		    // (Если нет то возвращает ответ через reply)
		    // Если да то вызывает return true
		}
		else { return true // вызывается если авторизация не требуется}
	}
	catch (err) {
		console.log(err);
		return reply.send({ error: 500 })
	}
}

module.exports = { execute };
```