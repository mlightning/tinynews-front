angular.module('TinyNewsApp.Services')
    .service('Articles', function ($rootScope, $q, Article, ActiveUser) {

        // --
        // Properties
        // --

        var registry = {};

        // --
        // Private Service Methods
        // --

        /**
         * Save Article Facts
         *
         * @param   String  id      Article Identifier
         * @param   Array   facts   Array of Article Facts
         * @param   Func    cb      Completion Callback
         */
        var _save_facts = function(id, facts, cb) {
            if (facts && facts.length) {
                Article.get_facts(id)
                    .success(function(original_facts) {
                        var todo = {
                            create: [],
                            update: [],
                            delete: []
                        };

                        // Build a indexes to reduce the looping.
                        var changes_index = {};
                        for (var i in facts) {
                            console.log('Setting cindex', facts[i]['@rid'], facts[i]);
                            changes_index[facts[i]['@rid']] = facts[i];
                        }
                        var original_index = {};
                        for (var i in original_facts) {
                            console.log('Setting oindex', original_facts[i]['@rid'], original_facts[i]);
                            original_index[original_facts[i]['@rid']] = original_facts[i];
                        }

                        // Determine action required on each
                        for (var i in original_facts) {
                            if (changes_index[original_facts[i]['@rid']]) {
                                todo.update.push( changes_index[original_facts[i]['@rid']] );
                            } else {
                                todo.delete.push( original_facts[i] );
                            }
                        }
                        for (var i in facts) {
                            if (!original_index[facts[i]['@rid']]) {
                                todo.create.push( facts[i] );
                            }
                        }

                        // Make API requests
                        async.parallel({
                            // --
                            // Create new Facts
                            // --
                            create: function(done) {
                                async.each(todo.create, function(item, item_done) {
                                    Article.create_fact(id, item)
                                        .success(function(data) {
                                            item_done(null, data);
                                        })
                                        .error(function(data, status, headers, config) {
                                            item_done(data);
                                        });
                                }, function(err, res) {
                                    done(err, res);
                                });
                            },
                            // --
                            // Update existing Facts
                            // --
                            update: function(done) {
                                console.log(todo.update);
                                async.each(todo.update, function(item, item_done) {
                                    Article.update_fact(id, item['@rid'])
                                        .success(function(data) {
                                            item_done(null, data);
                                        })
                                        .error(function(data, status, headers, config) {
                                            item_done(data);
                                        });
                                }, function(err, res) {
                                    done(err, res);
                                });
                            },
                            // --
                            // Delete Facts
                            // --
                            delete: function(done) {
                                async.each(todo.delete, function(item, item_done) {
                                    Article.delete_fact(id, item['@rid'])
                                        .success(function(data) {
                                            item_done(null, data);
                                        })
                                        .error(function(data, status, headers, config) {
                                            item_done(data);
                                        });
                                }, function(err, res) {
                                    done(err, res);
                                });
                            }
                        }, function(errors, results) {
                            if (errors) {
                                cb(true);
                            } else {
                                cb(null, true);
                            }
                        });
                    })
                    .error(function(data, status, headers, config) {
                        cb(data);
                    });
            } else {
                cb();
            }
        };

        /**
         * Save Article Statements
         *
         * @param   String  id          Article Identifier
         * @param   Array   statements  Array of Article Facts
         * @param   Func    cb          Completion Callback
         */
        var _save_statements = function(id, statements, cb) {
            if (statements && statements.length) {
                Article.get_statements(id)
                    .success(function(original_statements) {
                        var todo = {
                            create: [],
                            update: [],
                            delete: []
                        };

                        // Build a indexes to reduce the looping.
                        var changes_index = {};
                        for (var i in statements) {
                            changes_index[statements[i]['@rid']] = statements[i];
                        }
                        var original_index = {};
                        for (var i in original_statements) {
                            original_index[original_statements[i]['@rid']] = original_statements[i];
                        }

                        // Determine action required on each
                        for (var i in original_statements) {
                            if (changes_index[original_statements[i]['@rid']]) {
                                todo.update.push( changes_index[original_statements[i]['@rid']] );
                            } else {
                                todo.delete.push( original_statements[i] );
                            }
                        }
                        for (var i in statements) {
                            if (!original_index[statements[i]['@rid']]) {
                                todo.create.push( statements[i] );
                            }
                        }

                        // Make API requests
                        async.parallel({
                            // --
                            // Create new Statements
                            // --
                            create: function(done) {
                                async.each(todo.create, function(item, item_done) {
                                    Article.create_statement(id, item)
                                        .success(function(data) {
                                            item_done(null, data);
                                        })
                                        .error(function(data, status, headers, config) {
                                            item_done(data);
                                        });
                                }, function(err, res) {
                                    done(err, res);
                                });
                            },
                            // --
                            // Update existing Statements
                            // --
                            update: function(done) {
                                console.log(todo.update);
                                async.each(todo.update, function(item, item_done) {
                                    Article.update_statement(id, item['@rid'])
                                        .success(function(data) {
                                            item_done(null, data);
                                        })
                                        .error(function(data, status, headers, config) {
                                            item_done(data);
                                        });
                                }, function(err, res) {
                                    done(err, res);
                                });
                            },
                            // --
                            // Delete Statements
                            // --
                            delete: function(done) {
                                async.each(todo.delete, function(item, item_done) {
                                    Article.delete_statement(id, item['@rid'])
                                        .success(function(data) {
                                            item_done(null, data);
                                        })
                                        .error(function(data, status, headers, config) {
                                            item_done(data);
                                        });
                                }, function(err, res) {
                                    done(err, res);
                                });
                            }
                        }, function(errors, results) {
                            if (errors) {
                                cb(true);
                            } else {
                                cb(null, true);
                            }
                        });
                    })
                    .error(function(data, status, headers, config) {
                        cb(data);
                    });
            } else {
                cb();
            }
        };

        // --
        // Init
        // --

        return {

            // --
            // Static Properties
            // --

            // ~~

            // --
            // Public Service Methods
            // --

            /**
             * Find an Article
             *
             * @returns Promise
             */
            Find: function(id) {
                var deferred = $q.defer();

                Article.get(id)
                    .success(function(data) {
                        registry[data['@rid']] = new Article(data);
                        deferred.resolve(registry[data['@rid']]);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },

            /**
             * Update an Article
             *
             * @param   Obj     article     Article to Update (only head data : body, featured, imageUrl, post_date, title, url). For a complete article object, use Save()
             * @returns Promise
             */

            Update: function(article){
                var deferred = $q.defer();
                if (article['@rid']) {
                    // --
                    // Updating Existing Article
                    // --
                    Article.update(article['@rid'], article)
                        .success(function(data) {
                            // Update the registry object
                            if (registry[data['@rid']]) {
                                for (var i in data) {
                                    registry[data['@rid']][i] = data[i];
                                }
                            } else {
                                registry[data['@rid']] = new Article(data);
                            }
                            deferred.resolve(registry[data['@rid']]);
                        })
                        .error(function(data, status, headers, config) {
                            deferred.reject(data);
                        });
                }else{
                    deferred.reject([]);
                }

                return deferred.promise;
            },

            /**
             * Save an Article
             *
             * @param   Obj     article     Article to Save
             * @returns Promise
             */
            Save: function(article) {
                var deferred = $q.defer();

                // New Object or Existing?
                if (article['@rid']) {
                    // --
                    // Updating Existing Article
                    // --
                    Article.update(article['@rid'], article)
                        .success(function(data) {
                            // Update the registry object
                            if (registry[data['@rid']]) {
                                for (var i in data) {
                                    registry[data['@rid']][i] = data[i];
                                }
                            } else {
                                registry[data['@rid']] = new Article(data);
                            }

                            async.parallel({
                                facts: function(cb) {
                                    _save_facts(article['@rid'], article.facts.immediate.concat(article.facts.contextual), cb);
                                },
                                statements: function(cb) {
                                    _save_statements(article['@rid'], article.statements.immediate.concat(article.statements.contextual), cb);
                                }
                            }, function(errors, results) {
                                if (errors) {
                                    deferred.reject('Error saving facts.');
                                } else {
                                    deferred.resolve(registry[data['@rid']]);
                                }
                            });
                        })
                        .error(function(data, status, headers, config) {
                            deferred.reject(data);
                        });
                } else {
                    // --
                    // Creating New Article
                    // --
                    Article.create(article)
                        .success(function(data, status, headers, config) {
                            registry[data['@rid']] = new Article(data);

                            async.parallel({
                                facts: function(cb) {
                                    _save_facts(article['@rid'], article.facts.immediate.concat(article.facts.contextual), cb);
                                },
                                statements: function(cb) {
                                    _save_statements(article['@rid'], article.statements.immediate.concat(article.statements.contextual), cb);
                                }
                            }, function(errors, results) {
                                if (errors) {
                                    deferred.reject('Error saving facts.');
                                } else {
                                    deferred.resolve(registry[data['@rid']]);
                                }
                            });
                        })
                        .error(function(data, status, headers, config) {
                            deferred.reject(data);
                        });
                }

                return deferred.promise;
            },

            /**
             * Retrieve featured articles
             */

            FetchFeatured: function() {
                var deferred = $q.defer();

                Article.get_featured()
                    .success(function(data) {
                        deferred.resolve(data.results);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },

            /**
             * Retrieve the active User's feed articles
             */
            FetchUserFeed: function() {
                var deferred = $q.defer();

                if (ActiveUser.Get('user')['@rid']) {
                    // Logged in user's get their custom feed
                    Article.feed(ActiveUser.Get('user')['@rid'])
                        .success(function(data) {
                            deferred.resolve(data.results);
                        })
                        .error(function(data, status, headers, config) {
                            deferred.reject(data, status, headers, config);
                        });
                } else {
                    // Anonymous users get nothing for now.
                    deferred.resolve([]);
                }

                return deferred.promise;
            },

             /**
             * Retrieve the active User's rating for the article
             */

            GetUserRating: function(article){
                var deferred = $q.defer();

                if (ActiveUser.Get('user')['@rid']) {

                    Article.get_user_rating(article["@rid"])
                        .success(function(data) {
                            deferred.resolve(data);
                        })
                        .error(function(data, status, headers, config) {
                            deferred.reject(data, status, headers, config);
                        });
                } else {
                    deferred.resolve([]);
                }

                return deferred.promise;
            },

            /**
             * User rates an article
             */

            Rate: function(article) {
                var deferred = $q.defer();
                    console.log("service call");
                    Article.rate(article["@rid"], article.user_rating)
                        .success(function(data) {

                            deferred.resolve(data.results);

                        })
                        .error(function() {
                            //console.log(arguments);
                        });

                return deferred.promise;
            }
        }
    });