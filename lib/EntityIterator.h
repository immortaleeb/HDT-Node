#ifndef ENTITY_ITERATOR_H
#define ENTITY_ITERATOR_H

#include <nan.h>
#include <Iterator.hpp>

using namespace hdt;

class EntityIterator : public Nan::ObjectWrap {
  public:
    // Creates a wrapped wrapped object
    static v8::Local<v8::Object> NewInstance(IteratorUCharString* iterator);

    // Initializes the template for this class
    static void Init(v8::Local<v8::Object> exports);

  private:
    IteratorUCharString* iterator;

    explicit EntityIterator(IteratorUCharString* iterator);
    ~EntityIterator();

    static NAN_METHOD(New);
    static NAN_METHOD(Next);

    static Nan::Persistent<v8::Function> constructor;
};

#endif
