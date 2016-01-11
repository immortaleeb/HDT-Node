#include <node.h>
#include <nan.h>
#include "HdtDocument.h"
#include "EntityIterator.h"

using namespace v8;

NAN_MODULE_INIT(InitHdtModule) {
  Nan::Set(target, Nan::New("HdtDocument").ToLocalChecked(),
                   Nan::New(HdtDocument::GetConstructor()));
  Nan::Set(target, Nan::New("createHdtDocument").ToLocalChecked(),
                   Nan::GetFunction(Nan::New<FunctionTemplate>(HdtDocument::Create)).ToLocalChecked());

  EntityIterator::Init(target);
}

NODE_MODULE(hdt, InitHdtModule)
