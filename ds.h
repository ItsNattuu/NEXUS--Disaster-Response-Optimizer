/* REFERENCE
  Special functions:
  cmp    get     push      set
  del    get_d   push_r    swap
  prec   range   push_pq   update_pq

  Commonly used functions:
  halt   len   new   str
*/

/* C library to achieve behavior of various containers
    through a single unified data structure.
    Copyright (c) 2026 Ajay Anand

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://gnu.org>.
*/

#ifndef ds_h378472
#define ds_h378472
#define DS_H_VER 20260819
struct _any;
typedef struct _any* T;
#define GET_FN_ARG2(arg1, arg2, name, ...) name
#define GET_FN_ARG3(arg1, arg2, arg3, name, ...) name
#define GET_FN_ARG4(arg1, arg2, arg3, arg4, name, ...) name

//////////////// Public Interface BEGINS ////////////////

#define cmp(...) GET_FN_ARG4(__VA_ARGS__, _cmp_other, _cmp_same, _cmp)(__VA_ARGS__)
#define get(...) GET_FN_ARG2(__VA_ARGS__, _get_idx, _get_l)(__VA_ARGS__)
#define get_d(...) GET_FN_ARG2(__VA_ARGS__, _get_idx_d, _get_ld)(__VA_ARGS__)
#define get_s(...) GET_FN_ARG2(__VA_ARGS__, _get_idx_s, _get_ls)(__VA_ARGS__)
#define push(...) GET_FN_ARG3(__VA_ARGS__, _push_v3, _push_v2)(__VA_ARGS__)
#define push_pq(...) GET_FN_ARG4(__VA_ARGS__, _push_pq_v4, _push_pq_v3)(__VA_ARGS__)
#define push_r(...) GET_FN_ARG3(__VA_ARGS__, _push_r_v3, _push_r_v2)(__VA_ARGS__)
#define range(...) GET_FN_ARG3(__VA_ARGS__, _range_part, _range_full)(__VA_ARGS__)
#define set(...) GET_FN_ARG4(__VA_ARGS__, _set_v4, _set_v3, _set_v2)(__VA_ARGS__)
#define set_r(...) GET_FN_ARG3(__VA_ARGS__, _set_r_idx, _set_r2)(__VA_ARGS__)
#define str(...) GET_FN_ARG4(__VA_ARGS__, _str_fmt, 0, 0, _str_prefmt)(__VA_ARGS__)
#define swap(...) GET_FN_ARG4(__VA_ARGS__, _swap_other, _swap_same)(__VA_ARGS__)
#define type(...) GET_FN_ARG2(__VA_ARGS__, _type_idx, _type_l)(__VA_ARGS__)
#define update_pq(...) GET_FN_ARG4(__VA_ARGS__, _update_pq_4, _update_pq_3)(__VA_ARGS__)
#define _update_pq_3(Z, Y, X) _Generic((X), int: _update_pq_d, double: _update_pq_d, char*: _update_pq_s, const char*: _update_pq_s, T: _update_pq_v)(Z, Y, X)
T      get_r       (T l);
double get_rd      (T l);
char*  get_rs      (T l);
int    halt        ();
double prec        (T l);
double prec_r      (T l);
int    len         (const T l);
T      new         ();
void   del         (T l);
void   del_r       (T l);
char   type_r      (T l);

//////////////// Public Interface ENDS ////////////////

int    _cmp_same   (T l1, int k1, int k2);
int    _cmp_other  (T l1, int k1, T l2, int k2);
T      _get_idx    (T l, int k);
double _get_idx_d  (T l, int k);
char*  _get_idx_s  (T l, int k);
T      _get_l      (T l);
double _get_ld     (T l);
char*  _get_ls     (T l);
void   _push_ld    (T l, double d);
void   _push_ls    (T l, const char* s);
void   _push_lv    (T l, T val);
void   _push_pq_d  (T l, double priority, double d);
void   _push_pq_s  (T l, double priority, const char* s);
void   _push_pq_v  (T l, double priority, T val);
#define _push_pq_v3(Z, Y, X) _Generic((X), int: _push_pq_d, double: _push_pq_d, char*: _push_pq_s, const char*: _push_pq_s, T: _push_pq_v)(Z, Y, X)
void   _push_pq_v4 (T l1, double priority, T l2, int k2);
void   _push_rd    (T l, double d);
void   _push_rs    (T l, const char* s);
void   _push_rv    (T l, T val);
#define _push_r_v2(Y, X) _Generic((X), int: _push_rd, double: _push_rd, char*: _push_rs, const char*: _push_rs, T: _push_rv)(Y, X)
void   _push_r_v3  (T l1, T l2, int k2);
#define _push_v2(Y, X) _Generic((X), int: _push_ld, double: _push_ld, char*: _push_ls, const char*: _push_ls, T: _push_lv)(Y, X)
void   _push_v3    (T l1, T l2, int k2);
T      _range_full (int a, int b);
T      _range_part (int a, int b, int n);
void   _set_idx_d  (T l, int k, double d);
void   _set_ld     (T l, double d);
void   _set_ls     (T l, const char* s);
void   _set_lv     (T l, T val);
void   _set_lv_idx (T l, T l2, int k2);
#define _set_r2(Y, X) _Generic((X), int: _set_rd, double: _set_rd, char*: _set_rs, const char*: _set_rs, T: _set_rv)(Y, X)
void   _set_r_idx  (T l, T l2, int k2);
void   _set_rd     (T l, double d);
void   _set_rs     (T l, const char* s);
void   _set_rv     (T l, T val);
void   _set_idx_s  (T l, int k, const char* s);
void   _set_idx_v  (T l, int k, T val);
#define _set_v2(Y, X) _Generic((X), int: _set_ld, double: _set_ld, char*: _set_ls, const char*: _set_ls, T: _set_lv)(Y, X)
#define _set_v3(Z, Y, X) _Generic((Y), int: _Generic((X), int: _set_idx_d, double: _set_idx_d, char*: _set_idx_s, const char*: _set_idx_s, T: _set_idx_v), T: _set_lv_idx)(Z, Y, X)
void   _set_v4     (T l1, int k1, T l2, int k2);
char * _str_fmt(const T l, const char* beg, const char* sep, const char* end);
char * _str_prefmt(const T l);
void   _swap_same  (T l1, int k1, int k2);
void   _swap_other (T l1, int k1, T l2, int k2);
char   _type_idx   (T l, int k);
char   _type_l     (T l);
void   _update_pq_d(T l, double k, double d);
void   _update_pq_s(T l, double k, const char* s);
void   _update_pq_v(T l, double k, T val);
void   _update_pq_4(T l, double k, T m, int idx);

#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <limits.h>

static void   _debg_print (T l);
static T      _get_pq_l   (T l);
static double _get_pq_ld  (T l);
static char*  _get_pq_ls  (T l);
static T      _get_pq_r   (T l);
static double _get_pq_rd  (T l);
static char*  _get_pq_rs  (T l);
static T      _news       (const char* s);
static void   _del_pq_l   (T l);
static void   _del_pq_r   (T l);
static char   _type_pq_l  (T l);
static char   _type_pq_r  (T l);

typedef int (*rbmap_cmp_fn)(const void *a, const void *b);

typedef void (*rbmap_free_fn)(void *ptr);

typedef void (*rbmap_visit_fn)(void *key, void *value, void *user_data);

typedef struct rb_node {
  void *key;
  void *value;
  int level;
  struct rb_node *left;
  struct rb_node *right;
} rb_node_t;

struct rbmap {
  rb_node_t *root;
  rb_node_t *nil;
  rbmap_cmp_fn cmpfn;
  size_t size;
};

typedef struct rbmap rbmap_t;

static rbmap_t *rbmap_create(rbmap_cmp_fn cmpfn)
{
  if (!cmpfn) return NULL;

  rbmap_t *map = (rbmap_t*)malloc(sizeof(*map));
  if (!map) return NULL;

  rb_node_t *nil = (rb_node_t*)malloc(sizeof(*nil));
  if (!nil) { free(map); return NULL; }

  nil->level = 0;
  nil->left = nil->right = nil;
  nil->key = nil->value = NULL;

  map->nil = nil;
  map->root = nil;
  map->cmpfn = cmpfn;
  map->size = 0;
  return map;
}

static void free_subtree(rbmap_t *map, rb_node_t *n,
                          rbmap_free_fn key_free, rbmap_free_fn value_free)
{
  if (n == map->nil) return;
  free_subtree(map, n->left, key_free, value_free);
  free_subtree(map, n->right, key_free, value_free);
  if (key_free) key_free(n->key);
  if (value_free) value_free(n->value);
  free(n);
}

static void rbmap_destroy(rbmap_t *map, rbmap_free_fn key_free, rbmap_free_fn value_free)
{
  if (!map) return;
  free_subtree(map, map->root, key_free, value_free);
  free(map->nil);
  free(map);
}

static size_t rbmap_size(const rbmap_t *map) { return map ? map->size : 0; }
static int rbmap_empty(const rbmap_t *map) { return rbmap_size(map) == 0; }

static rb_node_t *find_node(const rbmap_t *map, const void *key)
{
  rb_node_t *cur = map->root;
  while (cur != map->nil) {
    int c = map->cmpfn(key, cur->key);
    if (c == 0) return cur;
    cur = (c < 0) ? cur->left : cur->right;
  }
  return cur;
}

static int rbmap_search(const rbmap_t *map, const void *key, void **out_value)
{
  if (!map) return 0;
  rb_node_t *n = find_node(map, key);
  if (n == map->nil) return 0;
  if (out_value) *out_value = n->value;
  return 1;
}

static void *rbmap_get(const rbmap_t *map, const void *key)
{
  void *v = NULL;
  rbmap_search(map, key, &v);
  return v;
}

static rb_node_t *aa_skew(rbmap_t *map, rb_node_t *t)
{
  if (t == map->nil || t->left == map->nil) return t;
  if (t->left->level == t->level) {
    rb_node_t *l = t->left;
    t->left = l->right;
    l->right = t;
    return l;
  }
  return t;
}

static rb_node_t *aa_split(rbmap_t *map, rb_node_t *t)
{
  if (t == map->nil || t->right == map->nil || t->right->right == map->nil) return t;
  if (t->level == t->right->right->level) {
    rb_node_t *r = t->right;
    t->right = r->left;
    r->left = t;
    r->level++;
    return r;
  }
  return t;
}

static rb_node_t *aa_insert(rbmap_t *map, rb_node_t *t, void *key, void *value,
                            rbmap_free_fn old_value_free, int *result)
{
  if (t == map->nil) {
    rb_node_t *n = (rb_node_t*) malloc(sizeof(*n));
    if (!n) { *result = -1; return t; }
    n->key = key;
    n->value = value;
    n->level = 1;
    n->left = n->right = map->nil;
    *result = 1;
    return n;
  }

  int c = map->cmpfn(key, t->key);
  if (c < 0) {
    t->left = aa_insert(map, t->left, key, value, old_value_free, result);
  } else if (c > 0) {
    t->right = aa_insert(map, t->right, key, value, old_value_free, result);
  } else {
    if (old_value_free) old_value_free(t->value);
    t->value = value;
    *result = 0;
    return t;
  }

  if (*result == -1) return t;

  t = aa_skew(map, t);
  t = aa_split(map, t);
  return t;
}

static int rbmap_insert(rbmap_t *map, void *key, void *value, rbmap_free_fn old_value_free)
{
  if (!map) return -1;

  int result = 0;
  rb_node_t *new_root = aa_insert(map, map->root, key, value, old_value_free, &result);
  if (result == -1) return -1;

  map->root = new_root;
  if (result == 1) map->size++;
  return result;
}

static rb_node_t *tree_minimum(rbmap_t *map, rb_node_t *n)
{
  while (n->left != map->nil) n = n->left;
  return n;
}

static rb_node_t *tree_maximum(rbmap_t *map, rb_node_t *n)
{
  while (n->right != map->nil) n = n->right;
  return n;
}

typedef struct {
  rb_node_t *last;
  rb_node_t *deleted;
} aa_delete_ctx_t;

static rb_node_t *aa_delete(rbmap_t *map, rb_node_t *t, const void *key,
  aa_delete_ctx_t *ctx, rbmap_free_fn key_free, rbmap_free_fn value_free,
  int *found)
{
  if (t == map->nil) return t;

  ctx->last = t;
  if (map->cmpfn(key, t->key) < 0) {
    t->left = aa_delete(map, t->left, key, ctx, key_free, value_free, found);
  } else {
    ctx->deleted = t;
    t->right = aa_delete(map, t->right, key, ctx, key_free, value_free, found);
  }

  if (t == ctx->last && ctx->deleted != map->nil && map->cmpfn(key, ctx->deleted->key) == 0) {

    if (key_free) key_free(ctx->deleted->key);
    if (value_free) value_free(ctx->deleted->value);
    ctx->deleted->key = t->key;
    ctx->deleted->value = t->value;
    ctx->deleted = map->nil;
    *found = 1;

    rb_node_t *replacement = t->right;
    free(t);
    return replacement;
  }

  if (t->left->level < t->level - 1 || t->right->level < t->level - 1) {
    t->level--;
    if (t->right->level > t->level) {
      t->right->level = t->level;
    }
    t = aa_skew(map, t);
    t->right = aa_skew(map, t->right);
    t->right->right = aa_skew(map, t->right->right);
    t = aa_split(map, t);
    t->right = aa_split(map, t->right);
  }

  return t;
}

static int rbmap_delete(rbmap_t *map, const void *key, rbmap_free_fn key_free, rbmap_free_fn value_free)
{
  if (!map) return 0;

  aa_delete_ctx_t ctx;
  ctx.last = map->nil;
  ctx.deleted = map->nil;

  int found = 0;
  rb_node_t *new_root = aa_delete(map, map->root, key, &ctx, key_free, value_free, &found);
  map->root = new_root;
  if (found) map->size--;
  return found;
}

static void inorder(const rbmap_t *map, rb_node_t *n, rbmap_visit_fn visit, void *user_data)
{
  if (n == map->nil) return;
  inorder(map, n->left, visit, user_data);
  visit(n->key, n->value, user_data);
  inorder(map, n->right, visit, user_data);
}

static void rbmap_foreach(const rbmap_t *map, rbmap_visit_fn visit, void *user_data)
{
  if (!map || !visit) return;
  inorder(map, map->root, visit, user_data);
}

static int rbmap_min(const rbmap_t *map, void **out_key, void **out_value)
{
  if (!map || map->root == map->nil) return 0;
  rb_node_t *n = tree_minimum((rbmap_t *)map, map->root);
  if (out_key) *out_key = n->key;
  if (out_value) *out_value = n->value;
  return 1;
}

static int rbmap_max(const rbmap_t *map, void **out_key, void **out_value)
{
  if (!map || map->root == map->nil) return 0;
  rb_node_t *n = tree_maximum((rbmap_t *)map, map->root);
  if (out_key) *out_key = n->key;
  if (out_value) *out_value = n->value;
  return 1;
}

static int inorder_cmp(const rbmap_t* map1, const rbmap_t* map2, rb_node_t* n1, rb_node_t* n2) {
  if (n1 == map1->nil) return n2 != map2->nil?-1:0;
  if(n2 == map2->nil) return 1;
  int n = map1->cmpfn(n1->key, n2->key);
  if(n!=0) return n;
  n = map1->cmpfn(n1->value, n2->value);
  if(n!=0) return n;
  n = inorder_cmp(map1, map2, n1->left, n2->left);
  if(n!=0) return n;
  return inorder_cmp(map1, map2, n1->right, n2->right);
}

static int rbmap_cmp(const rbmap_t *map1, const rbmap_t *map2) {
  if(!map1) return map2?-1:0;
  if(!map2) return 1;
  return inorder_cmp(map1, map2, map1->root, map2->root);
}

static void rbmap_swap(const rbmap_t *map1, const void *key1, const rbmap_t *map2, const void *key2) {
  if(!map1 || !map2) return;
  rb_node_t *n1 = find_node(map1, key1);
  rb_node_t *n2 = find_node(map2, key2);
  if (n1 == map1->nil || n2 == map2->nil) return;
  T dummy = n1->value;
  n1->value = n2->value;
  n2->value = dummy;
}

struct _any {
  char type;
  union {
    double* d;
    char* s;
    rbmap_t* l;
  };
};

static int _usage = 0;

static void _destroy(void * e) {
  --_usage;
  T any = (T)e;
  switch(any->type) {
    case 'd': free(any->d); break;
    case 's': free(any->s); break;
    default:  rbmap_destroy(any->l, _destroy, _destroy);break;
  }
  free(e);
}

static T _newd(double d) {
  ++_usage;
  T any = (T)malloc(sizeof(struct _any));
  any->type = 'd';
  any->d = (double*)malloc(sizeof(double));
  *any->d = d;
  return any;
}

static T _news(const char* s) {
  ++_usage;
  int n = strlen(s);
  T any = (T)malloc(sizeof(struct _any));
  any->type = 's';
  any->s = (char*)malloc(n+1);
  memcpy(any->s, s, n);
  any->s[n] = 0;
  return any;
}

static int _cmp(const void *x, const void *y) {
  T a = (T)x, b = (T)y;
  if(a->type=='d') {
    if(b->type=='d') {
      double da = *a->d;
      double db = *b->d;
      return (da > db) - (da < db);
    }
    return -1;
  } else if(a->type=='s') {
    if(b->type=='d') return 1;
    if(b->type=='s') return strcmp((const char *)a->s, (const char *)b->s);
    return -1;
  }
  if(b->type=='d') return 1;
  if(b->type=='s') return 1;
  return rbmap_cmp(a->l, b->l);
}

static T _new() {
  ++_usage;
  T any = (T)malloc(sizeof(struct _any));
  any->type = 0;
  any->l = rbmap_create(_cmp);
  return any;
}

static int _SYS_ID = 0;
static T _sys = 0;

static T _sys_news(const char* s) {
  if(!_sys) _sys = _new();
  ++_SYS_ID;
  T key = _newd(_SYS_ID),
    val = _news(s);
  rbmap_insert(_sys->l, key, val, _destroy);
  return val;
}

static void _increment_base(const rbmap_t *map, rb_node_t *n, int offset)
{
  if (n == map->nil) return;
  _increment_base(map, n->left, offset);
  *((T)n->key)->d += offset;
  _increment_base(map, n->right, offset);
}

static void _incrementKeys(T l, int offset) {
  _increment_base(l->l, l->l->root, offset);
}

static T _copy(const T l) ;

static void _copy_base(const rbmap_t *map, rb_node_t *n, T any)
{
    if (n == map->nil) return;
    _copy_base(map, n->left, any);
    T new_key = _copy((T)n->key),
      new_val = _copy((T)n->value);
    rbmap_insert(any->l, new_key, new_val, _destroy);
    _copy_base(map, n->right, any);
}

static T _copy(const T l) {
  if(!l) return 0;
  if(l->type=='d') return _newd(*l->d);
  if(l->type=='s') return _news(l->s);
  T any = _new();
  _copy_base(l->l, l->l->root, any);
  return any;
}

static void _copy_base_key(const rbmap_t *map, rb_node_t *n, T any)
{
    if (n == map->nil) return;
    _copy_base_key(map, n->left, any);
    T new_key = _newd(len(any)),
      new_val = _copy((T)n->key);
    rbmap_insert(any->l, new_key, new_val, _destroy);
    _copy_base_key(map, n->right, any);
}

static T _iter_tmp;
static int _ITER_TMP_ID = 0;

static T _iter_new() {
  ++_ITER_TMP_ID;
  T key = _newd(_ITER_TMP_ID),
    val = _new();
  rbmap_insert(_iter_tmp->l, key, val, _destroy);
  return val;
}

static T _iterator(const T l) {
  T any = _iter_new();
  _copy_base_key(l->l, l->l->root, any);
  return any;
}

static T _getVal(T l, T iter, int i) {
  T key = _newd(i),
    ans = (T)rbmap_get(l->l, rbmap_get(iter->l, key));
  _destroy(key);
  return ans;
}

static T _get_l_key(T l) {
  void * key;
  rbmap_min(l->l, &key, NULL);
  return (T)key;
}

static T _get_r_key(T l) {
  void * key;
  rbmap_max(l->l, &key, NULL);
  return (T)key;
}

static void _print(T l, int level, int hascolon) {
  for(int i=0;i<level; ++i) printf("  ");
  if(l->type=='s') printf("%s", l->s);
  else if(l->type=='d') printf("%d", (int)(*l->d));
  else {
    T iter = _iterator(l),
      subiter = _iterator(iter);
    printf("[");
    printf("\n");
    for(int i=0; i<len(l); ++i) {
      T sube = _getVal(iter, subiter, i),
        e = _getVal(l, iter, i);
      _print(sube, level+1, 1);
      _print(e, level+1, 0);
    }
    for(int i=0;i<level; ++i) printf("  ");
    printf("]");
  }
  printf(hascolon?":":",\n");
}

static void _debug_print(T l) {
  _iter_tmp = _new();
  _print(l, 0, 0);
  _destroy(_iter_tmp);
}

int _cmp_same(T l1, int k1, int k2) { return _cmp_other(l1, k1, l1, k2); }

int _cmp_other(T l1, int k1, T l2, int k2) { return _cmp(_get_idx(l1, k1), _get_idx(l2, k2)); }

static T _get_pq_l(T l) { return (T)rbmap_get(l->l, _get_l_key(l)); }

static double _get_pq_ld(T l) { return *_get_pq_l(l)->d; }

static char* _get_pq_ls(T l) { return _get_pq_l(l)->s; }

static T _get_pq_r(T l) { return (T)rbmap_get(l->l, _get_r_key(l)); }

static double _get_pq_rd(T l) { return *_get_pq_r(l)->d; }

static char* _get_pq_rs(T l) { return _get_pq_r(l)->s; }

static void _del_pq_l(T l) { rbmap_delete(l->l, _get_l_key(l), _destroy, _destroy); }

static void _del_pq_r(T l) { rbmap_delete(l->l, _get_r_key(l), _destroy, _destroy); }

void _push_ld(T l, double d) {
  _incrementKeys(l, 1);
  rbmap_insert(l->l, _newd(0), _newd(d), _destroy);
}

void _push_ls(T l, const char* s) {
  _incrementKeys(l, 1);
  rbmap_insert(l->l, _newd(0), _news(s), _destroy);
}

void _push_lv(T l, T val) {
  _incrementKeys(l, 1);
  rbmap_insert(l->l, _newd(0), _copy(val), _destroy);
}

static int _PQ_ID = 0;
void _push_pq_d(T l, double priority, double d) {
  T key = _new();
  _push_rd(key, priority);
  _push_rd(key, _PQ_ID); ++_PQ_ID;
  rbmap_insert(l->l, key, _newd(d), _destroy);
}

void _push_pq_s(T l, double priority, const char* s) {
  T key = _new();
  _push_rd(key, priority);
  _push_rd(key, _PQ_ID); ++_PQ_ID;
  rbmap_insert(l->l, key, _news(s), _destroy);
}

void _push_pq_v(T l, double priority, T val) {
  T key = _new();
  _push_rd(key, priority);
  _push_rd(key, _PQ_ID); ++_PQ_ID;
  rbmap_insert(l->l, key, _copy(val), _destroy);
}

void _push_rd(T l, double d) {
  rbmap_insert(l->l, _newd(len(l)), _newd(d), _destroy);
}

void _push_rs(T l, const char* s) {
  rbmap_insert(l->l, _newd(len(l)), _news(s), _destroy);
}

void _push_rv(T l, T val) {
  rbmap_insert(l->l, _newd(len(l)), _copy(val), _destroy);
}

void   _push_pq_v4  (T l1, double priority, T l2, int k2) { _push_pq_v(l1, priority, _get_idx(l2, k2)); }

void   _push_r_v3    (T l1, T l2, int k2) { _push_rv(l1, _get_idx(l2, k2)); }

void   _push_v3    (T l1, T l2, int k2) { _push_lv(l1, _get_idx(l2, k2)); }

void _set_idx_d(T l, int k, double d) {
  T key = _newd(k);
  rbmap_insert(l->l, key, _newd(d), _destroy);
  _destroy(key);
}

void _set_ld(T l, double d) {
  T key = _get_l_key(l);
  rbmap_insert(l->l, key, _newd(d), _destroy);
}

void _set_ls(T l, const char* s) {
  T key = _get_l_key(l);
  rbmap_insert(l->l, key, _news(s), _destroy);
}

void _set_lv(T l, T val) {
  T key = _get_l_key(l);
  rbmap_insert(l->l, key, _copy(val), _destroy);
}

void _set_lv_idx(T l, T l2, int k2) {
  T key = _get_l_key(l);
  rbmap_insert(l->l, key, _copy(_get_idx(l2, k2)), _destroy);
}

void _set_rd(T l, double d) {
  T key = _get_r_key(l);
  rbmap_insert(l->l, key, _newd(d), _destroy);
}

void _set_rs(T l, const char* s) {
  T key = _get_r_key(l);
  rbmap_insert(l->l, key, _news(s), _destroy);
}

void _set_rv(T l, T val) {
  T key = _get_r_key(l);
  rbmap_insert(l->l, key, _copy(val), _destroy);
}

void _set_r_idx(T l, T l2, int k2) {
  T key = _get_r_key(l);
  rbmap_insert(l->l, key, _copy(_get_idx(l2, k2)), _destroy);
}

void _set_idx_s(T l, int k, const char* s){
  T key = _newd(k);
  rbmap_insert(l->l, key, _news(s), _destroy);
  _destroy(key);
}

void _set_idx_v(T l, int k, T val) {
  T key = _newd(k);
  rbmap_insert(l->l, key, _copy(val), _destroy);
  _destroy(key);
}

void _set_v4(T l1, int k1, T l2, int k2) {
  _set_idx_v(l1, k1, _get_idx(l2, k2));
}

static char _type_pq_l(T l) { return _get_pq_l(l)->type; }

static char _type_pq_r(T l) { return _get_pq_r(l)->type; }

void _update_pq_d(T l, double priority, double d) {
  _iter_tmp = _new();
  T val = _newd(d),
    iter = _iterator(l),
    subiter = _iterator(iter);
  for(int i=0; i<len(l); ++i) {
    T key = _getVal(iter, subiter, i),
      e = _getVal(l, iter, i);
    if(_cmp(e, val)==0) {
      rbmap_delete(l->l, key, _destroy, _destroy);
      _push_pq_d(l, priority, d);
      break;
    }
  }
  _destroy(val);
  _destroy(_iter_tmp);
}

void _update_pq_s(T l, double priority, const char* s) {
  _iter_tmp = _new();
  T val = _news(s),
    iter = _iterator(l),
    subiter = _iterator(iter);
  for(int i=0; i<len(l); ++i) {
    T key = _getVal(iter, subiter, i),
      e = _getVal(l, iter, i);
    if(_cmp(e, val)==0) {
      rbmap_delete(l->l, key, _destroy, _destroy);
      _push_pq_s(l, priority, s);
      break;
    }
  }
  _destroy(val);
  _destroy(_iter_tmp);
}

void _update_pq_v(T l, double priority, T val) {
  _iter_tmp = _new();
  T iter = _iterator(l),
    subiter = _iterator(iter);
  for(int i=0; i<len(l); ++i) {
    T key = _getVal(iter, subiter, i),
      e = _getVal(l, iter, i);
    if(_cmp(e, val)==0) {
      rbmap_delete(l->l, key, _destroy, _destroy);
      _push_pq_v(l, priority, val);
      break;
    }
  }
  _destroy(_iter_tmp);
}

void _update_pq_4(T l, double priority, T m, int idx) {
  _update_pq_v(l, priority, _get_idx(m, idx));
}

T _get_idx(T l, int i) {
  T key = _newd(i),
    ans = (T)rbmap_get(l->l, key);
  _destroy(key);
  return ans;
}

double get_d(T l, int k) { return *_get_idx(l, k)->d; }

T _get_l(T l) { return _get_pq_l(l); }

double _get_ld(T l) { return _get_pq_ld(l); }

char* _get_ls(T l) { return _get_pq_ls(l); }

T get_r(T l) { return _get_pq_r(l); }

double get_rd(T l) { return _get_pq_rd(l); }

char* get_rs(T l) { return _get_pq_rs(l); }

char* get_s(T l, int k) { return _get_idx(l, k)->s; }

int halt() {
  if(_sys) _destroy(_sys);
  return _usage;
}

double prec(T l) { return get_d(_get_l_key(l), 0); }

double prec_r(T l) { return get_d(_get_r_key(l), 0); }

int len(const T l) {
  switch(l->type) {
    case 'd': return 0;
    case 's': return strlen(l->s);
    default: return rbmap_size(l->l);
  }
}

T new() {
  if(!_sys) _sys = _new();
  ++_SYS_ID;
  T key = _newd(_SYS_ID),
    val = _new();
  rbmap_insert(_sys->l, key, val, _destroy);
  return val;
}

void del(T l) {
  if(_get_l_key(l)->type=='d') _incrementKeys(l, -1);
  _del_pq_l(l);
}

void del_r(T l) { _del_pq_r(l); }

T _range_full(int a, int b) {
  T l = new();
  for(int i=a; i<b; ++i)
    _push_rd(l, i);
  return l;
}

T _range_part(int a, int b, int n) {
  T l = new();
  for(int i=0; i<n; ++i)
    _push_rd(l, a+rand()%(b-a));
  return l;
}

void _swap_same(T l1, int k1, int k2) { _swap_other(l1, k1, l1, k2); }

void _swap_other(T l1, int k1, T l2, int k2) {
  T p1 = _newd(k1), p2 = _newd(k2);
  rbmap_swap(l1->l, p1, l2->l, p2);
  _destroy(p1); _destroy(p2);
}

char type(T l, int k) { return _get_idx(l, k)->type; }

char _type_l(T l) { return _type_pq_l(l); }

char type_r(T l) { return _type_pq_r(l); }

/////////////////////////////////////

static T _str_tmp;
static int _STR_TMP_ID = 0;

static T _tmp_news(const char* s) {
  ++_STR_TMP_ID;
  T key = _newd(_STR_TMP_ID),
    val = _news(s);
  rbmap_insert(_str_tmp->l, key, val, _destroy);
  return val;
}

static const char * EPS = "";
static char * _to_str(const T l, const char* beg, const char* sep, const char* end );
static char * _to_str_recursive(rbmap_t* map, rb_node_t *n, const char* beg, const char* sep, const char* end) {
  if (n == map->nil) return (char*)EPS;
  char * ls = _to_str_recursive(map, n->left, beg, sep, end);
  // char * keys = _to_str(n->key);
  char * vals = _to_str((T)n->value, beg, sep, end);
  char * rs = _to_str_recursive(map, n->right, beg, sep, end);
  char * buf = (char*)malloc(strlen(ls)/*+strlen(keys)+1*/+strlen(vals)+strlen(sep)+strlen(rs)+1);
  int pos = 0;
  memcpy(buf+pos, ls, strlen(ls)); pos += strlen(ls);
  // memcpy(buf+pos, keys, strlen(keys)); pos += strlen(keys);
  // memcpy(buf+pos, ":", 1); pos += 1;
  memcpy(buf+pos, vals, strlen(vals)); pos += strlen(vals);
  memcpy(buf+pos, sep, strlen(sep)); pos += strlen(sep);
  memcpy(buf+pos, rs, strlen(rs)); pos += strlen(rs);
  buf[pos] = 0;
  T ans = _tmp_news(buf);
  free(buf);
  return ans->s;
}

static char * _to_str(const T l, const char* beg, const char* sep, const char* end ) {
  if(l->type=='d') {
    char buffer[50];
    if(fabs(*l->d-(int)(*l->d))<1e-6)
      snprintf(buffer, sizeof(buffer), "%d", (int)(*l->d));
    else snprintf(buffer, sizeof(buffer), "%f", *l->d);
    return _tmp_news(buffer)->s;
  }
  if(l->type=='s') return l->s;

  const char* ans =  _to_str_recursive(l->l, l->l->root, beg, sep, end);
  if(strlen(ans)==0) ans = sep;
  char * buf = (char*)malloc(strlen(ans)+strlen(beg)+strlen(end)-strlen(sep)+1);
  int pos = 0;
  memcpy(buf+pos, beg, strlen(beg)); pos += strlen(beg);
  memcpy(buf+pos, ans, strlen(ans)-strlen(sep)); pos += strlen(ans)-strlen(sep);
  memcpy(buf+pos, end, strlen(end)); pos += strlen(end);
  buf[pos] = 0;
  T res = _tmp_news(buf);
  free(buf);
  return res->s;
}

char * _str_fmt(const T l, const char* beg, const char* sep, const char* end) {
  _str_tmp = _new();
  T ans = _sys_news(_to_str(l, beg, sep, end));
  _destroy(_str_tmp);
  return ans->s;
}

char * _str_prefmt(const T l) { return _str_fmt(l, "[ ", ", ", " ]"); }

#endif
