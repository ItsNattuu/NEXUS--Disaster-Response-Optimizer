#include <stdarg.h>

void connectNode(T g, int count, ...) {
    T l = new();
    va_list args;
    va_start(args, count);
    for (int i=0; i<2*count; i++)
      push_r(l, va_arg(args, int));
    va_end(args);
    push_r(g, l);
}

T makeGraph1() {
  T g = new();
  connectNode(g, 2, 1, 4, 7, 8);
  connectNode(g, 3, 0, 4, 2, 8, 7, 11);
  connectNode(g, 4, 1, 8, 8, 2, 5, 4, 3, 7);
  connectNode(g, 3, 2, 7, 4, 9, 5, 14);
  connectNode(g, 2, 3, 9, 5, 10);
  connectNode(g, 4, 2, 4, 3, 14, 4, 10, 6, 2);
  connectNode(g, 3, 5, 2, 7, 1, 8, 6);
  connectNode(g, 4, 0, 8, 1, 11, 6, 1, 8, 7);
  connectNode(g, 3, 2, 2, 6, 6, 7, 7);
  return g;
}

T hmStr(T l, T s) {
  T m = new();
  if(len(l)==1) {
    push_r(m, l);
    push_r(m, "=");
    push_r(m, s);
    push_r(m, "  ");
  } else {
    T m1 = new();
    push_r(m1, s);
    push_r(m1, "0");
    push_r(m, hmStr(get(l), m1));
    T m2 = new();
    push_r(m2, s);
    push_r(m2, "1");
    push_r(m, hmStr(get(l, 1), m2));
  }
  return m;
};

