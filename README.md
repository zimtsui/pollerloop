# pollerloop

pollerloop 用于把一个循环协程转换为 Service。

务必使用 pollerloop 提供的 sleep 函数来阻塞协程，否则 pollerloop 被 stop 时不能即使恢复阻塞。

当 pollerloop 被 stop 时，所有阻塞都会立即以 rejected。对于没有立即 await 的阻塞，如果 stop 时他的 await 语句还没有执行到，就会变成 unhandledRejection，所以在创建阻塞时及时 `.catch(() => {})`。
