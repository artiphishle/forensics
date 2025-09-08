package com.example.myapp.b;

import com.example.myapp.a.A;

public class B {
  static {
    System.out.println("B prints A:" + new A());
  }
}
