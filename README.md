# pollerloop

pollerloop 框架用于把一个循环协程转换为 Serivice。

务必使用 pollerloop 提供的 sleep 函数来阻塞协程，否则 pollerloop 被 stop 时不能即使恢复阻塞。
