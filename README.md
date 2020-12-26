# Pollerloop

## Brief

Pollerloop 用于把一个循环协程转换可以优雅启停的 [Startable](https://github.com/zimtsui/startable)。

## Usage

```ts
import Pollerloop from 'pollerloop';

const pollerloop = new Pollerloop(async sleep => {
    while () {
        console.log('nihao');
        await sleep(1000);
    }
});

pollerloop.start();
pollerloop.stop();
```

务必使用 pollerloop 提供的 sleep 函数来阻塞协程。当 pollerloop 被 stop 时，所有阻塞都会立即以 rejected。对于没有立即 await 的阻塞，如果 stop 时他的 await 语句还没有执行到，就会变成 unhandledRejection，所以在创建阻塞时及时 `.catch(() => {})`。

你可以随时 `await sleep(0)` 来检测现在是否应该结束循环。
