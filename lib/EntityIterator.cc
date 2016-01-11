#include "EntityIterator.h"

#include <string>

Nan::Persistent<v8::Function> EntityIterator::constructor;

EntityIterator::EntityIterator(IteratorUCharString* it) : iterator(it) {
}

EntityIterator::~EntityIterator() {
  if (iterator)
    delete iterator;
}

void EntityIterator::Init(v8::Local<v8::Object> exports) {
  Nan::HandleScope scope;

  // Prepare constructor template
  v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
  tpl->SetClassName(Nan::New("EntityIterator").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // Prototype
  Nan::SetPrototypeMethod(tpl, "next", Next);

  constructor.Reset(tpl->GetFunction());
  exports->Set(Nan::New("EntityIterator").ToLocalChecked(), tpl->GetFunction());
}

NAN_METHOD(EntityIterator::New) {
  assert(info.IsConstructCall());
  // FIXME Should probably not give a null pointer here
  EntityIterator* obj = new EntityIterator(nullptr);
  obj->Wrap(info.This());
  info.GetReturnValue().Set(info.This());
}

class NextWorker : public Nan::AsyncWorker {
private:
  IteratorUCharString* iterator;
  unsigned char *result;

public:
  NextWorker(IteratorUCharString* iterator, Nan::Callback *callback) :  Nan::AsyncWorker(callback), iterator(iterator) {
  }

  void Execute() {
    result = iterator->next();
  }

  void HandleOKCallback() {
    Nan::HandleScope scope;
    // Create a v8 string
    v8::Local<v8::Value> entity = Nan::New(std::string(reinterpret_cast<char*>(result))).ToLocalChecked();

    // Call callback
    const unsigned argc = 1;
    v8::Local<v8::Value> argv[argc] = { entity };
    callback->Call(argc, argv);
  }
};

NAN_METHOD(EntityIterator::Next) {
  assert(info.Length() == 1);
  EntityIterator* obj = ObjectWrap::Unwrap<EntityIterator>(info.Holder());
  Nan::AsyncQueueWorker(new NextWorker(
        obj->iterator,
        new Nan::Callback(info[0].As<v8::Function>())));
}

// Factory method
v8::Local<v8::Object> EntityIterator::NewInstance(IteratorUCharString* iterator) {
  Nan::EscapableHandleScope scope;
  EntityIterator* object = new EntityIterator(iterator);
  v8::Local<v8::Object> instance = Nan::New(constructor)->NewInstance();
  object->Wrap(instance);

  return scope.Escape(instance);
}
