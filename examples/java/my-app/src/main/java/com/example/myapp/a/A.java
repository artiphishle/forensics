package com.example.myapp.a;

import com.example.myapp.b.B;
import com.example.myapp.c.C;
import com.example.myapp.d.D;

public class A {
  static {
    System.out.println("A prints B:" + new B());
    System.out.println("A prints C:" + new C());
    System.out.println("A prints D:" + new D());
  }
}
